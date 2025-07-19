import { Op } from 'sequelize';
import type { CategoryId, Tag } from './config';
import { Item } from './models';
import { CatalogItem } from './types';

export function parseJsonArray<T>(input: string | null): T[] | undefined {
    if (!input) {
        return undefined;
    }
    try {
        return JSON.parse(input);
    } catch {
        try {
            return JSON.parse(input.replace(/'/g, '"'));
        } catch (e) {
            console.warn('⚠️ Failed to parse JSON array:', input, e);
            return undefined;
        }
    }
}

type CategoryStats = {
    count: number;
    totalPaid: number;
    marketValue: number;
};

export async function getCategoryStats(
    items: CatalogItem[],
): Promise<Record<CategoryId | 'uncategorised', CategoryStats>> {
    const stats: Record<CategoryId | 'uncategorised', CategoryStats> =
        {} as any;

    for (const item of items) {
        const key = (item.category || 'uncategorised') as
            | CategoryId
            | 'uncategorised';
        if (!stats[key]) {
            stats[key] = { count: 0, totalPaid: 0, marketValue: 0 };
        }
        stats[key].count++;
        stats[key].totalPaid += item.pricePaid || 0;
        stats[key].marketValue += item.marketValue || 0;
    }

    return stats;
}

export async function loadCatalog(userId: string): Promise<CatalogItem[]> {
    const items = await Item.findAll({ where: { userId } });

    return items.map((i) => ({
        id: i.id,
        title: i.title,
        category: i.category as CatalogItem['category'],
        subcategory: (i.subcategory || undefined) as CatalogItem['subcategory'],
        desc: i.desc || undefined,
        notes: i.notes || undefined,
        flags: parseJsonArray<Tag>(i.flags),
        purchaseDate: i.purchaseDate || undefined,
        condition: i.condition || undefined,
        forTrade: i.forTrade,
        forSale: i.forSale,
        pricePaid: i.pricePaid || undefined,
        marketValue: i.marketValue || undefined,
        images: parseJsonArray<string>(i.images),
    }));
}

export async function addItem(
    userId: string,
    item: CatalogItem,
): Promise<void> {
    await Item.create({
        ...item,
        userId,
        flags: item.flags ? JSON.stringify(item.flags) : null,
        images: item.images ? JSON.stringify(item.images) : null,
    });
}

export async function getItem(
    userId: string,
    id: string,
): Promise<CatalogItem | null> {
    const item = await Item.findOne({ where: { userId, id } });
    if (!item) {
        return null;
    }

    return {
        id: item.id,
        title: item.title,
        category: item.category as CatalogItem['category'],
        subcategory: (item.subcategory ||
            undefined) as CatalogItem['subcategory'],
        desc: item.desc || undefined,
        notes: item.notes || undefined,
        flags: parseJsonArray<Tag>(item.flags),
        purchaseDate: item.purchaseDate || undefined,
        condition: item.condition || undefined,
        forTrade: item.forTrade,
        forSale: item.forSale,
        pricePaid: item.pricePaid || undefined,
        marketValue: item.marketValue || undefined,
        images: parseJsonArray<string>(item.images),
    };
}

export async function updateItem(
    userId: string,
    id: string,
    updates: Partial<CatalogItem>,
): Promise<void> {
    const item = await Item.findOne({ where: { userId, id } });
    if (!item) {
        return;
    }
    await item.update({
        ...updates,
        flags: updates.flags ? JSON.stringify(updates.flags) : item.flags,
        images: updates.images ? JSON.stringify(updates.images) : item.images,
    });
}

export async function deleteItem(userId: string, id: string): Promise<void> {
    await Item.destroy({ where: { userId, id } });
}

export async function updateMany(
    userId: string,
    ids: string[],
    updates: Partial<CatalogItem>,
): Promise<void> {
    await Item.update(
        {
            ...updates,
            flags: updates.flags ? JSON.stringify(updates.flags) : undefined,
            images: updates.images ? JSON.stringify(updates.images) : undefined,
        },
        { where: { userId, id: { [Op.in]: ids } } },
    );
}

export interface SearchOptions {
    query?: string;
    category?: string;
    subcategory?: string;
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'title' | 'pricePaid' | 'marketValue';
    order?: 'asc' | 'desc';
}

export async function searchCatalog(
    userId: string,
    opts: SearchOptions,
): Promise<CatalogItem[]> {
    let items = await loadCatalog(userId);

    if (opts.query) {
        const q = opts.query.toLowerCase();
        items = items.filter(
            (i) =>
                i.title.toLowerCase().includes(q) ||
                i.desc?.toLowerCase().includes(q),
        );
    }

    if (opts.category) {
        items = items.filter((i) => i.category === opts.category);
    }
    if (opts.subcategory) {
        items = items.filter((i) => i.subcategory === opts.subcategory);
    }
    if (opts.tag) {
        items = items.filter((i) => i.flags?.includes(opts.tag as Tag));
    }
    if (opts.minPrice !== undefined) {
        items = items.filter(
            (i) => (i.marketValue || 0) >= (opts.minPrice as number),
        );
    }
    if (opts.maxPrice !== undefined) {
        items = items.filter(
            (i) => (i.marketValue || 0) <= (opts.maxPrice as number),
        );
    }

    const sortField = opts.sort || 'title';
    const order = opts.order === 'desc' ? 'desc' : 'asc';

    items.sort((a, b) => {
        let result = 0;
        if (sortField === 'pricePaid') {
            result = (a.pricePaid || 0) - (b.pricePaid || 0);
        } else if (sortField === 'marketValue') {
            result = (a.marketValue || 0) - (b.marketValue || 0);
        } else {
            result = a.title.localeCompare(b.title);
        }
        return order === 'desc' ? -result : result;
    });

    return items;
}
