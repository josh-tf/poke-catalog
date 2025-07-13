export type Category = 'Cards' | 'Graded' | 'Boosters' | 'Collection Boxes';

export interface CatalogItem {
    id: string;
    category: Category;
    title: string;
    desc?: string;
    notes?: string;
    flags?: string[];
    pricePaid?: number;
    marketValue?: number;
    images?: string[];
}
