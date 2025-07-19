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

export const sets: {
    group: string;
    sets: SetItem[];
}[] = [
    {
        group: 'Scarlet and Violet',
        sets: [
            { name: 'Scarlet ex', code: 'sv1s', language: 'japanese' },
            { name: 'Violet ex', code: 'sv1v', language: 'japanese' },
        ],
    },
];
