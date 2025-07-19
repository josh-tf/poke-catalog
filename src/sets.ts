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
    code: string;
    language: Language;
    slug: string;
    sets: SetItem[];
}

export const sets: SetGroup[] = [
    {
        group: 'Scarlet and Violet',
        code: 'SV',
        language: 'japanese',
        slug: slugify('Scarlet and Violet'),
        sets: [
            { name: 'Scarlet ex', code: 'sv1s', language: 'japanese' },
            { name: 'Violet ex', code: 'sv1v', language: 'japanese' },
        ],
    },
    {
        group: 'Scarlet and Violet',
        code: 'SV',
        language: 'english',
        slug: slugify('Scarlet and Violet EN'),
        sets: [
            { name: 'Scarlet & Violet', code: 'sv1', language: 'english' },
            { name: 'Paldea Evolved', code: 'sv2', language: 'english' },
        ],
    },
];
