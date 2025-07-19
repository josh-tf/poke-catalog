# poke-catalog

Simple Express + EJS application to track Pokémon items.

Copy `env.template` to `.env` and fill in the values. Set `PORT` to change the
server port (defaults to `3000`). Then run `yarn dev` and visit
`http://localhost:3000` (or your chosen port).

## Features

- Upload items individually or in bulk.
- View items in list or grid layouts.
- Sort items by title, price paid or market value and filter by category.
- View detailed information for an item.
- Edit or delete items, including managing images.
- Select multiple items in the list view and apply bulk edits.

## Getting started

1. Copy `env.template` to `.env` and fill in `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_CALLBACK_URL` and `SESSION_SECRET`.
2. The SQLite database is stored in `data/db.sqlite`.

### Commands

- `yarn dev` - start the development server
- `yarn build` - compile TypeScript to `dist`

## License

The code is licensed under the [MIT License](LICENSE). Pokémon artwork and set images are not covered; see [NOTICE](NOTICE).
