# poke-catalog

Simple Express + EJS application to track Pokémon items. Run `yarn dev` and
visit `http://localhost:3000`.

## Features

- Upload items individually or in bulk.
- View items in list or grid layouts.
- Sort items by title, price paid or market value and filter by category.
- View detailed information for an item.
- Edit or delete items, including managing images.
- Select multiple items in the list view and apply bulk edits.

## Getting Started

1. Copy `env.template` to `.env` and fill in `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` and `SESSION_SECRET`.
2. The SQLite database is stored in `data/db.sqlite`.

### Commands

- `yarn dev` - start the development server
- `yarn build` - compile TypeScript to `dist`
