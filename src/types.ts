import type { CategoryId, SubcategoryId, Tag } from './config';

export type Category = CategoryId;

export interface CatalogItem {
    id: string;
    category: Category;
    subcategory?: SubcategoryId;
    title: string;
    desc?: string;
    notes?: string;
    flags?: Tag[];
    purchaseDate?: string;
    condition?: string;
    forTrade?: boolean;
    forSale?: boolean;
    pricePaid?: number;
    marketValue?: number;
    images?: string[];
}
