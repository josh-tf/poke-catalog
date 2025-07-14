import type { CategoryId, Tag } from './config';

export type Category = CategoryId;

export interface CatalogItem {
    id: string;
    category: Category;
    title: string;
    desc?: string;
    notes?: string;
    flags?: Tag[];
    pricePaid?: number;
    marketValue?: number;
    images?: string[];
}
