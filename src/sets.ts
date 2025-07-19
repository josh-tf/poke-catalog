export type Language = 'english' | 'japanese';

export interface SetItem {
    name: string;
    code: string;
    language: Language;
}

export const languageItemTypes: Record<Language, string[]> = {
    english: ['booster bundle', 'elite trainer box', 'booster box'],
    japanese: ['booster pack', 'booster box'],
};

import { slugify } from './utils';

export interface SetGroup {
    group: string;
    slug: string;
    sets: SetItem[];
}

export const sets: SetGroup[] = [
    {
        group: 'Scarlet and Violet',
        slug: slugify('Scarlet and Violet'),
        sets: [
            { name: 'Scarlet ex', code: 'sv1s', language: 'japanese' },
            { name: 'Violet ex', code: 'sv1v', language: 'japanese' },
        ],
    },
];
