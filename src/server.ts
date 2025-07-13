import express from 'express';
import multer from 'multer';
import path from 'path';
import { addItem, loadCatalog } from './catalog';
import { CatalogItem } from './types';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Home page - list items
app.get('/', (req, res) => {
    const items = loadCatalog();
    res.render('index', { items });
});

// Form to add new item
app.get('/add', (req, res) => {
    res.render('add');
});

// Handle form submit
const upload = multer({
    dest: path.join(__dirname, '../public/uploads'),
});

app.post('/add', upload.array('images', 5), (req, res) => {
    console.log('🧾 BODY:', req.body);
    console.log('📸 FILES:', req.files);

    const { id, title, desc, notes, flags, pricePaid, marketValue } = req.body;
    const files = req.files as Express.Multer.File[];

    const newItem: CatalogItem = {
        id,
        title,
        desc,
        notes,
        flags: flags ? flags.split(',').map((f: string) => f.trim()) : [],
        pricePaid: parseFloat(pricePaid) || 0,
        marketValue: parseFloat(marketValue) || 0,
        images: files?.map((file) => `/uploads/${file.filename}`) || [],
    };

    addItem(newItem);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(
        '🟢 Server running — visit http://localhost:3000 to view or add items.',
    );
});
