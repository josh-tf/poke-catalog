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
    fs.mkdirSync(path.dirname(CATALOG_PATH), { recursive: true });
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(items, null, 2));
}

export function addItem(item: CatalogItem): void {
    const items = loadCatalog();
    items.push(item);
    saveCatalog(items);
    console.log(`✅ Added item: ${item.title}`);
}

export function getItem(id: string): CatalogItem | undefined {
    const items = loadCatalog();
    return items.find((i) => i.id === id);
}

export function updateItem(id: string, updates: Partial<CatalogItem>): void {
    const items = loadCatalog();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
        return;
    }
    items[index] = { ...items[index], ...updates };
    saveCatalog(items);
}

export function deleteItem(id: string): void {
    let items = loadCatalog();
    items = items.filter((i) => i.id !== id);
    saveCatalog(items);
}

export function updateMany(ids: string[], updates: Partial<CatalogItem>): void {
    const items = loadCatalog();
    for (const item of items) {
        if (ids.includes(item.id)) {
            Object.assign(item, updates);
        }
    }
    saveCatalog(items);
}
