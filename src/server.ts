import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import multer from 'multer';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import path from 'path';
import {
    addItem,
    deleteItem,
    getItem,
    loadCatalog,
    updateItem,
    updateMany,
} from './catalog';
import { CatalogItem } from './types';
dotenv.config();

const app = express();
const PORT = 3000;

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

app.use(
    session({
        secret: 'pokecatalog',
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(passport.initialize());
app.use(passport.session());

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
    (req, res) => {
        res.redirect('/');
    },
);

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const upload = multer({
    dest: path.join(__dirname, '../public/uploads'),
});

// Home page - list items
app.get('/', (req, res) => {
    const userId = (req.user as any)?.id;
    let items = userId ? loadCatalog(userId) : [];
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

    res.render('index', { user: req.user, items, view, sort, order, category });
});

// Check if an item ID already exists
app.get('/check-id/:id', (req, res) => {
    const id = req.params.id;
    const userId = (req.user as any)?.id;
    const items = userId ? loadCatalog(userId) : [];
    const exists = items.some((item) => item.id === id);
    res.json({ exists });
});

// Form to add new item
app.get('/add', ensureAuth, (req, res) => {
    res.render('add', { user: req.user });
});

// Handle image upload and show detail form
app.post('/bulk-add', ensureAuth, upload.array('images', 20), (req, res) => {
    const files = req.files as Express.Multer.File[];
    res.render('bulk_details', { user: req.user, files });
});

// Bulk upload select images
app.get('/bulk-add', ensureAuth, (req, res) => {
    res.render('bulk_upload', { user: req.user });
});

// Save bulk items
app.post('/bulk-add/save', ensureAuth, (req, res) => {
    const ids = Array.isArray(req.body.id) ? req.body.id : [req.body.id];
    const titles = Array.isArray(req.body.title)
        ? req.body.title
        : [req.body.title];
    const descs = Array.isArray(req.body.desc)
        ? req.body.desc
        : [req.body.desc];
    const pricePaids = Array.isArray(req.body.pricePaid)
        ? req.body.pricePaid
        : [req.body.pricePaid];
    const marketValues = Array.isArray(req.body.marketValue)
        ? req.body.marketValue
        : [req.body.marketValue];
    const categories = Array.isArray(req.body.category)
        ? req.body.category
        : [req.body.category];
    const images = Array.isArray(req.body.image)
        ? req.body.image
        : [req.body.image];

    for (let i = 0; i < images.length; i++) {
        const item: CatalogItem = {
            id: ids[i],
            title: titles[i],
            category: categories[i],
            desc: descs[i],
            pricePaid: parseFloat(pricePaids[i]) || 0,
            marketValue: parseFloat(marketValues[i]) || 0,
            images: [images[i]],
        };
        addItem((req.user as any).id, item);
    }

    res.redirect('/');
});

// Handle form submit
app.post('/add', ensureAuth, upload.array('images', 5), (req, res) => {
    console.log('🧾 BODY:', req.body);
    console.log('📸 FILES:', req.files);

    const { id, title, desc, notes, flags, pricePaid, marketValue, category } =
        req.body;
    const files = req.files as Express.Multer.File[];

    const newItem: CatalogItem = {
        id,
        title,
        category,
        desc,
        notes,
        flags: flags ? flags.split(',').map((f: string) => f.trim()) : [],
        pricePaid: parseFloat(pricePaid) || 0,
        marketValue: parseFloat(marketValue) || 0,
        images: files?.map((file) => `/uploads/${file.filename}`) || [],
    };

    addItem((req.user as any).id, newItem);
    res.redirect('/');
});

// View item details
app.get('/item/:id', ensureAuth, (req, res) => {
    const item = getItem((req.user as any).id, req.params.id);
    if (!item) {
        return res.status(404).send('Not found');
    }
    res.render('item', { user: req.user, item });
});

// Edit item form
app.get('/item/:id/edit', ensureAuth, (req, res) => {
    const item = getItem((req.user as any).id, req.params.id);
    if (!item) {
        return res.status(404).send('Not found');
    }
    res.render('edit', { user: req.user, item });
});

// Handle edit
app.post(
    '/item/:id/edit',
    ensureAuth,
    upload.array('newImages', 5),
    (req, res) => {
        const id = req.params.id;
        const item = getItem((req.user as any).id, id);
        if (!item) {
            return res.status(404).send('Not found');
        }
        const removeImages = Array.isArray(req.body.removeImages)
            ? req.body.removeImages
            : req.body.removeImages
              ? [req.body.removeImages]
              : [];
        let images = item.images || [];
        images = images.filter((img) => !removeImages.includes(img));
        const files = req.files as Express.Multer.File[];
        if (files?.length) {
            images = images.concat(files.map((f) => `/uploads/${f.filename}`));
        }
        updateItem((req.user as any).id, id, {
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
    },
);

// Delete item
app.post('/item/:id/delete', ensureAuth, (req, res) => {
    deleteItem((req.user as any).id, req.params.id);
    res.redirect('/');
});

// Show bulk edit form
app.get('/bulk-edit', ensureAuth, (req, res) => {
    const ids = Array.isArray(req.query.ids)
        ? (req.query.ids as string[])
        : req.query.ids
          ? [req.query.ids as string]
          : [];
    const userId = (req.user as any).id;
    const items = loadCatalog(userId).filter((i) => ids.includes(i.id));
    res.render('bulk_edit', { user: req.user, items });
});

// Apply bulk edits
app.post('/bulk-edit', ensureAuth, (req, res) => {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [req.body.ids];
    const updates: Partial<CatalogItem> = {};
    if (req.body.category) {
        updates.category = req.body.category as CatalogItem['category'];
    }
    updateMany((req.user as any).id, ids, updates);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(
        '🟢 Server running — visit http://localhost:3000 to view or add items.',
    );
});
