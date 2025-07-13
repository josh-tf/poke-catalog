import { Op } from 'sequelize';
import { Item } from './models';
import { CatalogItem } from './types';

export async function loadCatalog(userId: string): Promise<CatalogItem[]> {
    const items = await Item.findAll({ where: { userId } });
    return items.map((i) => ({
        id: i.id,
        title: i.title,
        category: i.category as any,
        desc: i.desc || undefined,
        notes: i.notes || undefined,
        flags: i.flags ? JSON.parse(i.flags) : undefined,
        pricePaid: i.pricePaid || undefined,
        marketValue: i.marketValue || undefined,
        images: i.images ? JSON.parse(i.images) : undefined,
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
        category: item.category as any,
        desc: item.desc || undefined,
        notes: item.notes || undefined,
        flags: item.flags ? JSON.parse(item.flags) : undefined,
        pricePaid: item.pricePaid || undefined,
        marketValue: item.marketValue || undefined,
        images: item.images ? JSON.parse(item.images) : undefined,
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
