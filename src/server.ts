import SequelizeStoreInit from 'connect-session-sequelize';
import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import expressLayouts from 'express-ejs-layouts';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import path from 'path';

import fs from 'fs';
import {
    addItem,
    deleteItem,
    getItem,
    loadCatalog,
    parseJsonArray,
    updateItem,
    updateMany,
} from './catalog';
import {
    Collection,
    Item,
    ProfileComment,
    sequelize,
    syncDb,
    User,
} from './models';
import { CatalogItem, Category } from './types';

const validCategories: Category[] = [
    'Cards',
    'Graded',
    'Booster Box',
    'Collection Boxes',
];

function safeCategory(input: string): Category {
    if (validCategories.includes(input as Category)) {
        return input as Category;
    }
    return 'Cards';
}

dotenv.config();

function genRandomId(): string {
    return String(Math.floor(Math.random() * 90000) + 10000);
}

async function makeUniqueId(base: string, userId: string): Promise<string> {
    const items = await loadCatalog(userId);
    let id: string;
    do {
        id = `${base}-${genRandomId()}`;
    } while (items.some((item) => item.id === id));
    return id;
}

function slugify(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function makeUniqueSlug(name: string, userId: string): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let i = 1;
    while (await Collection.findOne({ where: { userId, slug } })) {
        slug = `${base}-${i++}`;
    }
    return slug;
}

const app = express();
const PORT = 3000;

const uploadsPath = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}

const categories = ['Cards', 'Graded', 'Booster Box', 'Collection Boxes'];

// ----- Authentication Setup -----
const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || '';
const CALLBACK_URL =
    process.env.DISCORD_CALLBACK_URL ||
    'http://localhost:3000/auth/discord/callback';

passport.use(
    new DiscordStrategy(
        {
            clientID: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            callbackURL: CALLBACK_URL,
            scope: ['identify'],
        },
        (accessToken, refreshToken, profile, done) => done(null, profile),
    ),
);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj as any);
});

const SequelizeStore = SequelizeStoreInit(session.Store);

const sessionStore = new SequelizeStore({
    db: sequelize,
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'pokecatalog',
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

function ensureAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/login', passport.authenticate('discord'));

app.get(
    '/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/' }),
    async (req, res) => {
        const profile = req.user as any;
        if (profile) {
            await User.upsert({
                id: profile.id,
                username: profile.username,
                avatar: profile.avatar,
            });
        }
        res.redirect('/catalog');
    },
);

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/catalog');
    });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(async (req, res, next) => {
    res.locals.title = 'Poké Catalog';
    if (req.user) {
        const dbUser = await User.findByPk((req.user as any).id);
        if (dbUser) {
            Object.assign(req.user as any, dbUser.get());
        }
    }
    res.locals.user = req.user;
    next();
});

// Home page with social feed and stats
app.get('/', async (req, res) => {
    const collections = await Collection.findAll({
        where: { public: true },
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [User],
    });
    for (const col of collections) {
        const imgs = await Item.findAll({
            where: { collectionId: col.id },
            limit: 4,
        });
        (col as any).thumbs = imgs
            .map((i) => parseJsonArray<string>(i.images)?.[0])
            .filter(Boolean);
    }
    const stats = {
        users: await User.count(),
        collections: await Collection.count(),
        items: await Item.count(),
    };

    const topRaw = await Item.findAll({
        attributes: [
            'userId',
            [sequelize.fn('COUNT', sequelize.col('id')), 'itemCount'],
        ],
        group: ['userId'],
        order: [[sequelize.literal('itemCount'), 'DESC']],
        limit: 5,
    });
    const topUsers = [] as { user: User; itemCount: number }[];
    for (const row of topRaw) {
        const u = await User.findByPk(row.get('userId') as string);
        if (u) {
            topUsers.push({ user: u, itemCount: Number(row.get('itemCount')) });
        }
    }

    const recentUsers = await User.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
    });

    res.render('home', {
        user: req.user,
        collections,
        stats,
        topUsers,
        recentUsers,
    });
});

// Catalog page - list items
app.get('/catalog', async (req, res) => {
    const userId = (req.user as any)?.id;
    let items = userId ? await loadCatalog(userId) : [];
    const view = (req.query.view as string) || 'list';
    const sort = (req.query.sort as string) || 'title';
    const order = (req.query.order as string) === 'desc' ? 'desc' : 'asc';
    const category = (req.query.category as string) || '';

    if (category) {
        items = items.filter((item) => item.category === category);
    }

    items.sort((a, b) => {
        let result = 0;
        if (sort === 'pricePaid') {
            result = (a.pricePaid || 0) - (b.pricePaid || 0);
        } else if (sort === 'marketValue') {
            result = (a.marketValue || 0) - (b.marketValue || 0);
        } else {
            result = a.title.localeCompare(b.title);
        }
        return order === 'desc' ? -result : result;
    });

    const categories: Category[] = [
        'Cards',
        'Graded',
        'Booster Box',
        'Collection Boxes',
    ];
    const categoryData: Record<Category, number> = {
        Cards: 0,
        Graded: 0,
        'Booster Box': 0,
        'Collection Boxes': 0,
    };
    for (const item of items) {
        categoryData[item.category]++;
    }

    res.render('catalog', {
        user: req.user,
        items,
        view,
        sort,
        order,
        category,
        categoryData,
        categories,
    });
});

// Check if an item ID already exists
app.get('/check-id/:id', async (req, res) => {
    const id = req.params.id;
    const userId = (req.user as any)?.id;
    const items = userId ? await loadCatalog(userId) : [];
    const exists = items.some((item) => item.id === id);
    res.json({ exists });
});

// Form to add new item
app.get('/add', ensureAuth, (req, res) => {
    res.render('add', { user: req.user });
});

// Handle image upload and show detail form
app.post('/bulk-add', ensureAuth, (req, res) => {
    if (!req.files || !req.files.images) {
        return res.status(400).send('No files were uploaded.');
    }

    const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

    // Move files to /public/uploads
    const savedFiles = [];
    for (const file of files) {
        const ext = path.extname(file.name);
        const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        const uploadPath = path.join(__dirname, '../public/uploads', filename);
        file.mv(uploadPath, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
        });
        savedFiles.push({
            name: filename,
            path: `/uploads/${filename}`,
        });
    }

    res.render('bulk_details', { user: req.user, files: savedFiles });
});

// Bulk upload select images
app.get('/bulk-add', ensureAuth, (req, res) => {
    res.render('bulk_upload', { user: req.user });
});

// Save bulk items
app.post('/bulk-add/save', ensureAuth, async (req, res) => {
    const toArray = (input: any): string[] =>
        Array.isArray(input) ? input : [input];

    const ids = toArray(req.body.id);
    const titles = toArray(req.body.title);
    const descs = toArray(req.body.desc);
    const pricePaids = toArray(req.body.pricePaid);
    const marketValues = toArray(req.body.marketValue);
    const categories = toArray(req.body.category);
    const images = toArray(req.body.image);

    const userId = (req.user as any).id;

    for (let i = 0; i < images.length; i++) {
        const baseId = ids[i]?.trim() || 'item';
        const uniqueId = await makeUniqueId(baseId, userId);

        const item: CatalogItem = {
            id: uniqueId,
            title: titles[i],
            category: safeCategory(categories[i]),
            desc: descs[i],
            pricePaid: parseFloat(pricePaids[i]) || 0,
            marketValue: parseFloat(marketValues[i]) || 0,
            images: [images[i]],
        };

        await addItem(userId, item);
    }

    res.redirect('/catalog');
});

// Handle form submit
app.post('/add', ensureAuth, async (req, res) => {
    const rawId = (req.body.id || '').trim();
    if (!rawId) {
        return res.status(400).send('Please supply a base ID.');
    }

    const userId = (req.user as any).id;
    const uniqueId = await makeUniqueId(rawId, userId);

    const files = Array.isArray(req.files?.images)
        ? req.files.images
        : req.files?.images
          ? [req.files.images]
          : [];

    const savedPaths: string[] = [];
    for (const file of files) {
        const ext = path.extname(file.name);
        const filename = `${crypto.randomBytes(16).toString('hex')}${ext}`;
        const uploadPath = path.join(__dirname, '../public/uploads', filename);
        await file.mv(uploadPath);
        savedPaths.push(`/uploads/${filename}`);
    }

    const newItem: CatalogItem = {
        id: uniqueId,
        title: req.body.title,
        category: req.body.category,
        desc: req.body.desc,
        notes: req.body.notes,
        flags: req.body.flags
            ? req.body.flags.split(',').map((f: string) => f.trim())
            : [],
        pricePaid: parseFloat(req.body.pricePaid) || 0,
        marketValue: parseFloat(req.body.marketValue) || 0,
        images: savedPaths,
    };

    await addItem(userId, newItem);
    res.redirect('/catalog');
});

// View item details
app.get('/item/:id', ensureAuth, async (req, res) => {
    const item = await getItem((req.user as any).id, req.params.id);
    if (!item) {
        return res.status(404).send('Not found');
    }
    res.render('item', { user: req.user, item, categories });
});

// Edit item form
app.get('/item/:id/edit', ensureAuth, async (req, res) => {
    const item = await getItem((req.user as any).id, req.params.id);
    if (!item) {
        return res.status(404).send('Not found');
    }
    res.render('edit', { user: req.user, item, categories });
});

// Handle edit
app.post('/item/:id/edit', ensureAuth, async (req, res) => {
    const id = req.params.id;
    const item = await getItem((req.user as any).id, id);
    if (!item) {
        return res.status(404).send('Not found');
    }

    // Determine which existing images to remove
    const removeImages = Array.isArray(req.body.removeImages)
        ? req.body.removeImages
        : req.body.removeImages
          ? [req.body.removeImages]
          : [];

    // Start with current images and filter out removed ones
    let images = item.images || [];
    images = images.filter((img) => !removeImages.includes(img));

    // Handle new uploaded files
    const rawFiles = req.files?.newImages;
    const files = Array.isArray(rawFiles)
        ? rawFiles
        : rawFiles
          ? [rawFiles]
          : [];

    for (const file of files) {
        const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const uploadPath = path.join(__dirname, '../public/uploads', filename);
        await file.mv(uploadPath);
        images.push(`/uploads/${filename}`);
    }

    // Update item in DB
    await updateItem((req.user as any).id, id, {
        title: req.body.title,
        desc: req.body.desc,
        notes: req.body.notes,
        category: req.body.category,
        flags: req.body.flags
            ? req.body.flags.split(',').map((f: string) => f.trim())
            : [],
        pricePaid: parseFloat(req.body.pricePaid) || 0,
        marketValue: parseFloat(req.body.marketValue) || 0,
        images,
    });

    res.redirect(`/item/${id}`);
});

// Delete item
app.post('/item/:id/delete', ensureAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const id = req.params.id;

    const item = await getItem(userId, id);
    if (!item) {
        return res.status(404).send('Item not found');
    }

    // Delete image files from disk
    if (Array.isArray(item.images)) {
        for (const imagePath of item.images) {
            const fullPath = path.join(__dirname, '../public', imagePath);
            fs.unlink(fullPath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.warn(`⚠️ Failed to delete file ${fullPath}:`, err);
                }
            });
        }
    }

    // Delete the item from the database
    await deleteItem(userId, id);
    res.redirect('/catalog');
});

// Show bulk edit form
app.get('/bulk-edit', ensureAuth, async (req, res) => {
    const ids = Array.isArray(req.query.ids)
        ? (req.query.ids as string[])
        : req.query.ids
          ? [req.query.ids as string]
          : [];
    const userId = (req.user as any).id;
    const items = (await loadCatalog(userId)).filter((i) => ids.includes(i.id));
    res.render('bulk_edit', { user: req.user, items, categories });
});

// Apply bulk edits
app.post('/bulk-edit', ensureAuth, async (req, res) => {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [req.body.ids];
    const action = req.body.action;
    const userId = (req.user as any).id;

    if (action === 'delete') {
        for (const id of ids) {
            await deleteItem(userId, id);
        }
        return res.redirect('/catalog');
    }

    const updates: Partial<CatalogItem> = {};
    if (req.body.category) {
        updates.category = req.body.category as CatalogItem['category'];
    }

    await updateMany(userId, ids, updates);
    res.redirect('/catalog');
});

// Create collection form
app.get('/collections', ensureAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const collections = await Collection.findAll({ where: { userId } });
    const enriched = [] as any[];
    for (const col of collections) {
        const count = await Item.count({ where: { collectionId: col.id } });
        const items = await Item.findAll({
            where: { collectionId: col.id },
            limit: 4,
        });
        const images = items
            .map((i) => parseJsonArray<string>(i.images)?.[0])
            .filter(Boolean);
        enriched.push({ ...col.get(), itemCount: count, images });
    }
    res.render('collections', { user: req.user, collections: enriched });
});

app.get('/collections/create', ensureAuth, (req, res) => {
    res.render('collection_form', { user: req.user });
});

// Handle create collection
app.post('/collections/create', ensureAuth, async (req, res) => {
    const userId = (req.user as any).id;
    const slug = await makeUniqueSlug(req.body.name, userId);
    await Collection.create({
        name: req.body.name,
        description: req.body.description,
        public: !!req.body.public,
        userId,
        slug,
    });
    res.redirect('/collections');
});

// View collection
app.get('/collections/:userId/:slug', async (req, res) => {
    const { userId, slug } = req.params;
    const collection = await Collection.findOne({
        where: { userId, slug },
        include: [User],
    });
    if (!collection) {
        return res.status(404).send('Not found');
    }
    if (!collection.public) {
        if (!req.isAuthenticated || !(req.user as any)?.id) {
            return res.redirect('/login');
        }
        if ((req.user as any).id !== collection.userId) {
            return res.redirect('/');
        }
    }
    const items = await Item.findAll({
        where: { collectionId: collection.id },
    });
    const parsedItems = items.map((i) => ({
        id: i.id,
        title: i.title,
        category: i.category as Category,
        desc: i.desc || undefined,
        notes: i.notes || undefined,
        pricePaid: i.pricePaid || undefined,
        marketValue: i.marketValue || undefined,
        images: parseJsonArray<string>(i.images),
    }));

    const categoryData: Record<Category, number> = {
        Cards: 0,
        Graded: 0,
        'Booster Box': 0,
        'Collection Boxes': 0,
    };
    for (const item of parsedItems) {
        categoryData[item.category]++;
    }

    const shareUrl = `${req.protocol}://${req.get('host')}/collections/${collection.userId}/${collection.slug}`;
    res.render('collection', {
        user: req.user,
        collection,
        items: parsedItems,
        shareUrl,
        categoryData,
    });
});

app.get('/collections/:userId', async (req, res) => {
    const { userId } = req.params;
    const showAll = (req.user as any)?.id === userId;

    const collections = await Collection.findAll({
        where: {
            userId,
            ...(showAll ? {} : { public: true }),
        },
    });

    const enriched = [];
    for (const col of collections) {
        const count = await Item.count({ where: { collectionId: col.id } });
        const items = await Item.findAll({
            where: { collectionId: col.id },
            limit: 4,
        });
        const images = items
            .map((i) => parseJsonArray<string>(i.images)?.[0])
            .filter(Boolean);
        enriched.push({ ...col.get(), itemCount: count, images });
    }

    res.render('collections', { user: req.user, collections: enriched });
});

app.get('/collections/:userId/:slug/edit', ensureAuth, async (req, res) => {
    const { userId, slug } = req.params;
    if ((req.user as any).id !== userId) {
        return res.status(403).send('Forbidden');
    }
    const collection = await Collection.findOne({ where: { userId, slug } });
    if (!collection) {
        return res.status(404).send('Not found');
    }
    const items = await Item.findAll({ where: { userId } });
    res.render('collection_edit', { user: req.user, collection, items });
});

app.post('/collections/:userId/:slug/edit', ensureAuth, async (req, res) => {
    const { userId, slug } = req.params;
    if ((req.user as any).id !== userId) {
        return res.status(403).send('Forbidden');
    }
    const collection = await Collection.findOne({ where: { userId, slug } });
    if (!collection) {
        return res.status(404).send('Not found');
    }

    const newSlug =
        collection.name === req.body.name
            ? slug
            : await makeUniqueSlug(req.body.name, userId);
    await collection.update({
        name: req.body.name,
        description: req.body.description,
        public: !!req.body.public,
        slug: newSlug,
    });

    const selected = Array.isArray(req.body.items)
        ? req.body.items
        : req.body.items
          ? [req.body.items]
          : [];
    const items = await Item.findAll({ where: { userId } });
    for (const item of items) {
        const shouldBelong = selected.includes(item.id);
        if (shouldBelong && item.collectionId !== collection.id) {
            await item.update({ collectionId: collection.id });
        } else if (!shouldBelong && item.collectionId === collection.id) {
            await item.update({ collectionId: null });
        }
    }

    res.redirect(`/collections/${userId}/${newSlug}`);
});

// User profile with comments
app.get('/user/:id', async (req, res) => {
    const userProfile = await User.findByPk(req.params.id);
    if (!userProfile) {
        return res.status(404).send('Not found');
    }

    const showAll = (req.user as any)?.id === userProfile.id;
    const collections = await Collection.findAll({
        where: { userId: userProfile.id, ...(showAll ? {} : { public: true }) },
    });
    const collectionsEnriched = [] as any[];
    for (const col of collections) {
        const count = await Item.count({ where: { collectionId: col.id } });
        const imgs = await Item.findAll({
            where: { collectionId: col.id },
            limit: 4,
        });
        const images = imgs
            .map((i) => parseJsonArray<string>(i.images)?.[0])
            .filter(Boolean);
        collectionsEnriched.push({ ...col.get(), itemCount: count, images });
    }
    const items = await loadCatalog(userProfile.id);
    const comments = await ProfileComment.findAll({
        where: { userId: userProfile.id },
        include: [{ model: User, as: 'commenter' }],
        order: [['createdAt', 'DESC']],
    });
    res.render('profile', {
        user: req.user,
        userProfile,
        showAll,
        comments,
        collections: collectionsEnriched,
        items,
    });
});

app.post('/user/:id/comment', ensureAuth, async (req, res) => {
    await ProfileComment.create({
        userId: req.params.id,
        commenterId: (req.user as any).id,
        content: req.body.content,
    });
    res.redirect(`/user/${req.params.id}`);
});

// ----- User Preferences -----
app.get('/preferences', ensureAuth, async (req, res) => {
    res.render('preferences', { user: req.user });
});

app.post('/preferences', ensureAuth, async (req, res) => {
    const dbUser = await User.findByPk((req.user as any).id);
    if (dbUser) {
        await dbUser.update({
            displayName: req.body.displayName || null,
            avatarUrl: req.body.avatarUrl || null,
            profileDesc: req.body.profileDesc || null,
            profileBanner: req.body.profileBanner || null,
            tagline: req.body.tagline || null,
            imageZoom: parseFloat(req.body.imageZoom) || 1,
        });
        Object.assign(req.user as any, dbUser.get());
    }
    res.redirect('/preferences');
});

async function start() {
    await syncDb();
    await sessionStore.sync();

    app.listen(PORT, () => {
        console.log(
            '🟢 Server running — visit http://localhost:3000 to view or add items.',
        );
    });
}

void start();
