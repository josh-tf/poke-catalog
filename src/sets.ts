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

export interface SetGroup {
    group: string;
    code: string;
    language: Language;
    slug: string;
    sets: SetItem[];
}

export const sets: SetGroup[] = [
    {
        'group': 'Mega Evolutions',
        'code': 'M',
        'language': 'english',
        'slug': 'mega-evolutions-en',
        'sets': [
            {
                'name': 'Mega Evolution Base',
                'code': 'meg',
                'language': 'english',
            },
        ],
    },
    {
        'group': 'Mega Evolutions',
        'code': 'M',
        'language': 'japanese',
        'slug': 'mega-evolutions',
        'sets': [
            {
                'name': 'Mega Symphonia',
                'code': 'm1s',
                'language': 'japanese',
            },
            {
                'name': 'Mega Brave',
                'code': 'm1l',
                'language': 'japanese',
            },
        ],
    },
    {
        'group': 'Scarlet and Violet',
        'code': 'SV',
        'language': 'english',
        'slug': 'scarlet-and-violet-en',
        'sets': [
            {
                'name': 'Black Bolt (BLK)',
                'code': 'blk',
                'language': 'english',
            },
            {
                'name': 'White Flare (WHT)',
                'code': 'wht',
                'language': 'english',
            },
            {
                'name': 'Destined Rivals (DRI)',
                'code': 'dri',
                'language': 'english',
            },
            {
                'name': 'Journey Together (JTG)',
                'code': 'jtg',
                'language': 'english',
            },
            {
                'name': 'Prismatic Evolutions (PRE)',
                'code': 'pre',
                'language': 'english',
            },
            {
                'name': 'Surging Sparks (SSP)',
                'code': 'ssp',
                'language': 'english',
            },
            {
                'name': 'Stellar Crown (SCR)',
                'code': 'scr',
                'language': 'english',
            },
            {
                'name': 'Shrouded Fable (SFA)',
                'code': 'sfa',
                'language': 'english',
            },
            {
                'name': 'Twilight Masquerade (TWM)',
                'code': 'twm',
                'language': 'english',
            },
            {
                'name': 'Temporal Forces (TEF)',
                'code': 'tef',
                'language': 'english',
            },
            {
                'name': 'Paldean Fates (PAF)',
                'code': 'paf',
                'language': 'english',
            },
            {
                'name': 'Paradox Rift (PAR)',
                'code': 'par',
                'language': 'english',
            },
            {
                'name': '151 (MEW)',
                'code': 'mew',
                'language': 'english',
            },
            {
                'name': 'McDonalds Match Battle 2023 (M23)',
                'code': 'm23',
                'language': 'english',
            },
            {
                'name': 'Obsidian Flames (OBF)',
                'code': 'obf',
                'language': 'english',
            },
            {
                'name': 'Paldea Evolved (PAL)',
                'code': 'pal',
                'language': 'english',
            },
            {
                'name': 'Scarlet & Violet Energy (SVE)',
                'code': 'sve',
                'language': 'english',
            },
            {
                'name': 'Scarlet & Violet (SVI)',
                'code': 'svi',
                'language': 'english',
            },
            {
                'name': 'Scarlet & Violet Promos (SVP)',
                'code': 'svp',
                'language': 'english',
            },
        ],
    },
    {
        'group': 'Scarlet and Violet',
        'code': 'SV',
        'language': 'japanese',
        'slug': 'scarlet-and-violet',
        'sets': [
            {
                'name': 'Scarlet ex',
                'code': 'sv1s',
                'language': 'japanese',
            },
            {
                'name': 'Violet ex',
                'code': 'sv1v',
                'language': 'japanese',
            },
            {
                'name': 'Triplet Beat',
                'code': 'sv1a',
                'language': 'japanese',
            },
            {
                'name': 'Clay Burst',
                'code': 'sv2d',
                'language': 'japanese',
            },
            {
                'name': 'Snow Hazard',
                'code': 'sv2p',
                'language': 'japanese',
            },
            {
                'name': 'Pokemon 151',
                'code': 'sv2a',
                'language': 'japanese',
            },
            {
                'name': 'Ruler of the Black Flame',
                'code': 'sv3',
                'language': 'japanese',
            },
            {
                'name': 'Raging Surf',
                'code': 'sv3a',
                'language': 'japanese',
            },
            {
                'name': 'Ancient Roar',
                'code': 'sv4k',
                'language': 'japanese',
            },
            {
                'name': 'Future Flash',
                'code': 'sv4k',
                'language': 'japanese',
            },
            {
                'name': 'Shiny Treasure ex',
                'code': 'sv4a',
                'language': 'japanese',
            },
            {
                'name': 'Wild Force',
                'code': 'sv5k',
                'language': 'japanese',
            },
            {
                'name': 'Cyber Judge',
                'code': 'sv5m',
                'language': 'japanese',
            },
            {
                'name': 'Crimson Haze',
                'code': 'sv5a',
                'language': 'japanese',
            },
            {
                'name': 'Mask of Change',
                'code': 'sv6',
                'language': 'japanese',
            },
            {
                'name': 'Night Wanderer',
                'code': 'sv6a',
                'language': 'japanese',
            },
            {
                'name': 'Stella Miracle',
                'code': 'sv7',
                'language': 'japanese',
            },
            {
                'name': 'Paradise Dragona',
                'code': 'sv7a',
                'language': 'japanese',
            },
            {
                'name': 'Super Electric Breaker',
                'code': 'sv8',
                'language': 'japanese',
            },
            {
                'name': 'Terastal Festival ex',
                'code': 'sv8a',
                'language': 'japanese',
            },
            {
                'name': 'Battle Partners',
                'code': 'sv9',
                'language': 'japanese',
            },
            {
                'name': 'Hot Air Arena',
                'code': 'sv9a',
                'language': 'japanese',
            },
            {
                'name': 'Glory of Team Rocket',
                'code': 'sv10',
                'language': 'japanese',
            },
            {
                'name': 'Black Bolt',
                'code': 'sv11b',
                'language': 'japanese',
            },
            {
                'name': 'White Flare',
                'code': 'sv11w',
                'language': 'japanese',
            },
        ],
    },
    {
        'group': 'Sword and Shield',
        'code': 'SWSH',
        'language': 'japanese',
        'slug': 'sword-and-shield',
        'sets': [
            {
                'name': 'Shield',
                'code': 's1h',
                'language': 'japanese',
            },
            {
                'name': 'Sword',
                'code': 's1w',
                'language': 'japanese',
            },
            {
                'name': 'VMAX Rising',
                'code': 's1a',
                'language': 'japanese',
            },
            {
                'name': 'Rebellion Crash',
                'code': 's2',
                'language': 'japanese',
            },
            {
                'name': 'Explosive Flame Walker',
                'code': 's2a',
                'language': 'japanese',
            },
            {
                'name': 'Infinity Zone',
                'code': 's3',
                'language': 'japanese',
            },
            {
                'name': 'Legendary Pulse',
                'code': 's3a',
                'language': 'japanese',
            },
            {
                'name': 'Electrifying Tackle',
                'code': 's4',
                'language': 'japanese',
            },
            {
                'name': 'Shiny Star V',
                'code': 's4a',
                'language': 'japanese',
            },
            {
                'name': 'Single Strike Master',
                'code': 's5i',
                'language': 'japanese',
            },
            {
                'name': 'Rapid Strike Master',
                'code': 's5r',
                'language': 'japanese',
            },
            {
                'name': 'Matchless Fighter',
                'code': 's5a',
                'language': 'japanese',
            },
            {
                'name': 'Silver Lance',
                'code': 's6h',
                'language': 'japanese',
            },
            {
                'name': 'Jet Black Spirit',
                'code': 's6k',
                'language': 'japanese',
            },
            {
                'name': 'Eevee Heroes',
                'code': 's6a',
                'language': 'japanese',
            },
            {
                'name': 'Towering Perfection',
                'code': 's7d',
                'language': 'japanese',
            },
            {
                'name': 'Blue Sky Stream',
                'code': 's7r',
                'language': 'japanese',
            },
            {
                'name': 'Fusion ARTS',
                'code': 's8',
                'language': 'japanese',
            },
            {
                'name': '25th Anniversary Collection',
                'code': 's8a',
                'language': 'japanese',
            },
            {
                'name': '25th Anniversary Promo Pack',
                'code': 's8ap',
                'language': 'japanese',
            },
            {
                'name': 'VMAX Climax',
                'code': 's8b',
                'language': 'japanese',
            },
            {
                'name': 'Start Deck 100',
                'code': 'si',
                'language': 'japanese',
            },
            {
                'name': 'Star Birth',
                'code': 's9',
                'language': 'japanese',
            },
            {
                'name': 'Battle Region',
                'code': 's9a',
                'language': 'japanese',
            },
            {
                'name': 'Space Juggler',
                'code': 's10p',
                'language': 'japanese',
            },
            {
                'name': 'Time Gazer',
                'code': 's10d',
                'language': 'japanese',
            },
            {
                'name': 'Dark Phantasma',
                'code': 's10a',
                'language': 'japanese',
            },
            {
                'name': 'Pokemon GO',
                'code': 's10b',
                'language': 'japanese',
            },
            {
                'name': 'Lost Abyss',
                'code': 's12',
                'language': 'japanese',
            },
            {
                'name': 'Incandescent Arcana',
                'code': 's11a',
                'language': 'japanese',
            },
            {
                'name': 'Paradigm Trigger',
                'code': 's12',
                'language': 'japanese',
            },
            {
                'name': 'VSTAR Universe',
                'code': 's12a',
                'language': 'japanese',
            },
        ],
    },
    {
        'group': 'Sun and Moon',
        'code': 'SM',
        'language': 'japanese',
        'slug': 'sun-and-moon',
        'sets': [
            {
                'name': 'Collection Moon',
                'code': 'sm1m',
                'language': 'japanese',
            },
            {
                'name': 'Collection Sun',
                'code': 'sm1s',
                'language': 'japanese',
            },
            {
                'name': 'Sun & Moon Strengthening Expansion',
                'code': 'sm1+',
                'language': 'japanese',
            },
            {
                'name': 'Islands Awaiting You',
                'code': 'sm2k',
                'language': 'japanese',
            },
            {
                'name': 'Alola Moonlight',
                'code': 'sm2l',
                'language': 'japanese',
            },
            {
                'name': 'Strengthening Expansion Pack: Beyond A New Challenge',
                'code': 'sm2+',
                'language': 'japanese',
            },
            {
                'name': 'Seen the Rainbow Battle',
                'code': 'sm3h',
                'language': 'japanese',
            },
            {
                'name': 'Light-Consuming Darkness',
                'code': 'sm3n',
                'language': 'japanese',
            },
            {
                'name': 'Strengthening Expansion: Shining Legends',
                'code': 'sm3+',
                'language': 'japanese',
            },
            {
                'name': 'The Awoken Hero',
                'code': 'sm4s',
                'language': 'japanese',
            },
            {
                'name': 'The Transdimensional Beast',
                'code': 'sm4a',
                'language': 'japanese',
            },
            {
                'name': 'GX Battle Boost',
                'code': 'sm4+',
                'language': 'japanese',
            },
            {
                'name': 'Ultra Moon',
                'code': 'sm5m',
                'language': 'japanese',
            },
            {
                'name': 'Ultra Sun',
                'code': 'sm5s',
                'language': 'japanese',
            },
            {
                'name': 'Ultra Force',
                'code': 'sm5+',
                'language': 'japanese',
            },
            {
                'name': 'Forbidden Light',
                'code': 'sm6',
                'language': 'japanese',
            },
            {
                'name': 'Dragon Storm',
                'code': 'sm6a',
                'language': 'japanese',
            },
            {
                'name': 'Champion Road',
                'code': 'sm6b',
                'language': 'japanese',
            },
            {
                'name': 'Charisma of the Cracked Sky',
                'code': 'sm7',
                'language': 'japanese',
            },
            {
                'name': 'Thunderclap Spark',
                'code': 'sm7a',
                'language': 'japanese',
            },
            {
                'name': 'Fairy Rise',
                'code': 'sm7b',
                'language': 'japanese',
            },
            {
                'name': 'Explosive Impact',
                'code': 'sm8',
                'language': 'japanese',
            },
            {
                'name': 'Dark Order',
                'code': 'sm8a',
                'language': 'japanese',
            },
            {
                'name': 'Ultra Shiny GX',
                'code': 'sm8b',
                'language': 'japanese',
            },
            {
                'name': 'Tag Bolt',
                'code': 'sm9',
                'language': 'japanese',
            },
            {
                'name': 'Night Unison',
                'code': 'sm9a',
                'language': 'japanese',
            },
            {
                'name': 'Full Metal Wall',
                'code': 'sm9b',
                'language': 'japanese',
            },
            {
                'name': 'Double Blaze',
                'code': 'sm10',
                'language': 'japanese',
            },
            {
                'name': 'GG End',
                'code': 'sm10a',
                'language': 'japanese',
            },
            {
                'name': 'Detective Pikachu',
                'code': 'smp2',
                'language': 'japanese',
            },
            {
                'name': 'Sky Legend',
                'code': 'sm10b',
                'language': 'japanese',
            },
            {
                'name': 'Miracle Twins',
                'code': 'sm11',
                'language': 'japanese',
            },
            {
                'name': 'Remix Bout',
                'code': 'sm11a',
                'language': 'japanese',
            },
            {
                'name': 'Dream League',
                'code': 'sm11b',
                'language': 'japanese',
            },
            {
                'name': 'Alter Genesis',
                'code': 'sm12',
                'language': 'japanese',
            },
            {
                'name': 'Tag Team GX All Stars',
                'code': 'sm12a',
                'language': 'japanese',
            },
        ],
    },
    {
        'group': 'XY',
        'code': 'XY',
        'language': 'japanese',
        'slug': 'xy',
        'sets': [
            {
                'name': 'XY Beginning Set',
                'code': 'hxy',
                'language': 'japanese',
            },
            {
                'name': 'Collection X',
                'code': 'xy1',
                'language': 'japanese',
            },
            {
                'name': 'Collection Y',
                'code': 'xy1',
                'language': 'japanese',
            },
            {
                'name': 'Yveltal Half Deck',
                'code': 'y30',
                'language': 'japanese',
            },
            {
                'name': 'Xerneas Half Deck',
                'code': 'x30',
                'language': 'japanese',
            },
            {
                'name': 'Wild Blaze',
                'code': 'xy2',
                'language': 'japanese',
            },
            {
                'name': 'M Charizard EX Mega Battle Deck',
                'code': 'xya',
                'language': 'japanese',
            },
            {
                'name': 'Rising Fist',
                'code': 'xy3',
                'language': 'japanese',
            },
            {
                'name': 'Phantom Gate',
                'code': 'xy4',
                'language': 'japanese',
            },
            {
                'name': 'Hyper Metal Chain Deck',
                'code': 'xyb',
                'language': 'japanese',
            },
            {
                'name': 'Tidal Storm',
                'code': 'xy5',
                'language': 'japanese',
            },
            {
                'name': 'Gaia Volcano',
                'code': 'xy5',
                'language': 'japanese',
            },
            {
                'name': 'Magma Gang vs Aqua Gang: Double Crisis',
                'code': 'cp1',
                'language': 'japanese',
            },
            {
                'name': 'Emerald Break',
                'code': 'xy6',
                'language': 'japanese',
            },
            {
                'name': 'Mega Rayquaza EX Battle Deck',
                'code': 'xyd',
                'language': 'japanese',
            },
            {
                'name': 'Bandit Ring',
                'code': 'xy7',
                'language': 'japanese',
            },
            {
                'name': 'Legendary Holo Collection',
                'code': 'cp2',
                'language': 'japanese',
            },
            {
                'name': 'Red Flash',
                'code': 'xy8',
                'language': 'japanese',
            },
            {
                'name': 'Blue Impact',
                'code': 'xy8',
                'language': 'japanese',
            },
            {
                'name': 'Raichu BREAK Evolution Pack',
                'code': 'snp',
                'language': 'japanese',
            },
            {
                'name': 'Noivern BREAK Evolution Pack',
                'code': 'snp',
                'language': 'japanese',
            },
            {
                'name': 'Golduck BREAK & Palkia EX Combo Deck',
                'code': 'xyf',
                'language': 'japanese',
            },
            {
                'name': 'Rage of the Broken Sky',
                'code': 'xy9',
                'language': 'japanese',
            },
            {
                'name': 'Pokekyun Collection',
                'code': 'cp3',
                'language': 'japanese',
            },
            {
                'name': 'Pokemon Card Game Starter Pack',
                'code': '20th',
                'language': 'japanese',
            },
            {
                'name': 'Zygarde EX Perfect Battle Deck',
                'code': 'xyg',
                'language': 'japanese',
            },
            {
                'name': 'Awakening of Psychic Kings',
                'code': 'xy10',
                'language': 'japanese',
            },
            {
                'name': 'Mega Audino EX Mega Battle Deck',
                'code': 'xyh',
                'language': 'japanese',
            },
            {
                'name': 'Premium Champion Pack: EX x M x BREAK',
                'code': 'cp4',
                'language': 'japanese',
            },
            {
                'name': 'Ruthless Rebel',
                'code': 'xy11',
                'language': 'japanese',
            },
            {
                'name': 'Explosive Warrior',
                'code': 'xy11',
                'language': 'japanese',
            },
            {
                'name': 'Mythical / Legendary Dream Holo Collection',
                'code': 'cp5',
                'language': 'japanese',
            },
            {
                'name': '20th Anniversary Collection',
                'code': 'cp6',
                'language': 'japanese',
            },
            {
                'name': 'The Best of XY',
                'code': 'xy',
                'language': 'japanese',
            },
        ],
    },
];
