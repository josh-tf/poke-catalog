export interface CatalogItem {
    id: string;
    title: string;
    desc?: string;
    notes?: string;
    flags?: string[];
    pricePaid?: number;
    marketValue?: number;
    images?: string[];
}
