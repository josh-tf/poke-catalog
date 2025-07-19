# poke-catalog

A web app to manage and view a catalog of Pokémon-related items — including upload, edit, and bulk actions. Built with **Express**, **EJS**, **TypeScript**, and **SQLite**. Includes Discord login integration via `passport-discord`.

---

## 📁 Project Structure

```
/
├── src/              → Main server code (Express, routing, controllers)
├── public/           → Static assets (CSS, images)
├── data/             → SQLite database (`db.sqlite`)
├── env.template      → Example .env file (required values)
├── tsconfig.json     → TypeScript config
├── nodemon.json      → Dev hot reload config
├── eslint.config.js  → ESLint rules (TS + Prettier + Unused Imports)
├── .prettierrc       → Formatting rules (used in lint-staged + CLI)
├── cspell.json       → Spell checker config
```

---

## 🛠️ Development Commands

- `yarn dev` → Run dev server with hot reload (`ts-node`, `nodemon`)
- `yarn build` → Compile TypeScript to `dist/`
- `yarn start` → Run compiled app (`node dist/index.js`)
- `yarn lint` → Lint staged files (run via husky pre-commit)
- `yarn lint:fix` → Lint + auto-fix entire codebase
- `yarn format` → Format all `ts`, `tsx`, `json`, and `md` files
- `yarn spell` → Run cspell on code/docs
- `yarn check:unused` → Detect unused dependencies with `depcheck`

---

## 🧹 Code Style & Rules

- **Language:** TypeScript (strict mode)
- **Formatter:** Prettier with `eslint-plugin-prettier`
- **Linting:** ESLint with:
    - `@typescript-eslint`
    - `unused-imports`
    - `eslint-plugin-import`
- **Hooks:** Husky runs lint-staged on commit
- **Prettier rules:** single quotes, no semicolons, 80–100 char width
- **Staged files:** auto-linted and formatted via `lint-staged`

---

## 🔐 Environment & Secrets

Env variables required in `.env`:

```env
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_CALLBACK_URL=...
SESSION_SECRET=...
```

- Rename `env.template` → `.env` and fill values
- Never commit actual `.env` or secrets
- `SESSION_SECRET` is required for Express session middleware
- Discord OAuth handled via `passport-discord`

---

## 🧠 Architecture Notes

- Uses **EJS** with `express-ejs-layouts` for templating
- Uses **SQLite3** + Sequelize for lightweight persistent storage
- Discord OAuth required for login, using `express-session`
- Items can be viewed, edited, bulk-updated, sorted, and deleted
- Images uploaded with `express-fileupload`, saved locally
- Routes follow conventional `GET`/`POST` with controller logic in `src/`

---
