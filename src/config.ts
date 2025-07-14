export const categories = [
    { id: 'cards', label: 'Cards' },
    { id: 'graded', label: 'Graded' },
    { id: 'booster-box', label: 'Booster Box' },
    { id: 'collection-boxes', label: 'Collection Boxes' },
] as const;

export const tags = ['for-sale', 'for-trade', 'wanted'] as const;

export type CategoryId = (typeof categories)[number]['id'];
export type Tag = (typeof tags)[number];
