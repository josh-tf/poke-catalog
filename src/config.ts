export const categories = [
    {
        id: 'cards',
        label: 'Cards',
        subcategories: [
            { id: 'cards-japanese', label: 'Japanese' },
            { id: 'cards-english', label: 'English' },
            { id: 'cards-other', label: 'Other' },
        ],
    },
    {
        id: 'graded',
        label: 'Graded',
        subcategories: [
            { id: 'graded-psa', label: 'PSA' },
            { id: 'graded-cgc', label: 'CGC' },
            { id: 'graded-bgs', label: 'BGS' },
            { id: 'graded-other', label: 'Other' },
        ],
    },
    {
        id: 'booster-box',
        label: 'Booster Box',
        subcategories: [
            { id: 'booster-box-japanese', label: 'Japanese' },
            { id: 'booster-box-english', label: 'English' },
        ],
    },
    {
        id: 'collection-boxes',
        label: 'Collection Boxes',
        subcategories: [
            { id: 'collection-boxes-japanese', label: 'Japanese' },
            { id: 'collection-boxes-english', label: 'English' },
        ],
    },
    {
        id: 'books',
        label: 'Books',
        subcategories: [
            { id: 'books-guide', label: 'Guidebooks' },
            { id: 'books-manga', label: 'Manga' },
        ],
    },
    {
        id: 'misc-items',
        label: 'Misc Items',
        subcategories: [
            { id: 'misc-toy', label: 'Toys' },
            { id: 'misc-apparel', label: 'Apparel' },
        ],
    },
    {
        id: 'collection-sets',
        label: 'Collection Sets',
        subcategories: [
            { id: 'collection-sets-japanese', label: 'Japanese' },
            { id: 'collection-sets-english', label: 'English' },
        ],
    },
] as const;

export const tags = ['for-sale', 'for-trade', 'wanted'] as const;

export type CategoryId = (typeof categories)[number]['id'];
export type SubcategoryId =
    (typeof categories)[number]['subcategories'][number]['id'];
export type Tag = (typeof tags)[number];
