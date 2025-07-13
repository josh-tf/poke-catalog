import fs from 'fs';
import path from 'path';
import { CatalogItem } from './types';

const CATALOG_PATH = path.join(__dirname, '../data/catalog.json');

export function loadCatalog(): CatalogItem[] {
    if (!fs.existsSync(CATALOG_PATH)) {
        return [];
    }
    const raw = fs.readFileSync(CATALOG_PATH, 'utf-8');
    return JSON.parse(raw);
}

export function saveCatalog(items: CatalogItem[]): void {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(items, null, 2));
}

export function addItem(item: CatalogItem): void {
    const items = loadCatalog();
    items.push(item);
    saveCatalog(items);
    console.log(`✅ Added item: ${item.title}`);
}
