import fs from 'fs';
import path from 'path';
import { CatalogItem } from './types';

function catalogPath(userId: string): string {
    return path.join(__dirname, `../data/${userId}/catalog.json`);
}

export function loadCatalog(userId: string): CatalogItem[] {
    const file = catalogPath(userId);
    if (!fs.existsSync(file)) {
        return [];
    }
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw);
}

export function saveCatalog(userId: string, items: CatalogItem[]): void {
    const file = catalogPath(userId);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(items, null, 2));
}

export function addItem(userId: string, item: CatalogItem): void {
    const items = loadCatalog(userId);
    items.push(item);
    saveCatalog(userId, items);
    console.log(`✅ Added item: ${item.title}`);
}

export function getItem(userId: string, id: string): CatalogItem | undefined {
    const items = loadCatalog(userId);
    return items.find((i) => i.id === id);
}

export function updateItem(
    userId: string,
    id: string,
    updates: Partial<CatalogItem>,
): void {
    const items = loadCatalog(userId);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
        return;
    }
    items[index] = { ...items[index], ...updates };
    saveCatalog(userId, items);
}

export function deleteItem(userId: string, id: string): void {
    let items = loadCatalog(userId);
    items = items.filter((i) => i.id !== id);
    saveCatalog(userId, items);
}

export function updateMany(
    userId: string,
    ids: string[],
    updates: Partial<CatalogItem>,
): void {
    const items = loadCatalog(userId);
    for (const item of items) {
        if (ids.includes(item.id)) {
            Object.assign(item, updates);
        }
    }
    saveCatalog(userId, items);
}
