# Anokhi Pehel

Anokhi Pehel is a web application for managing participants, users, events, attendance, mentors, and related programme data.

## Repository layout

- `client/` - React and Vite frontend.
- `server/` - Express and MongoDB backend.
- `docs/` - Architecture and development guidance.

## Prerequisites

- Node.js 18 or newer.
- npm.
- A MongoDB connection string and the external service credentials used by the server.

## Local setup

1. Install root dependencies with `npm install`.
2. Install frontend dependencies with `npm install --prefix client`.
3. Copy `server/.env.example` to `server/.env` and fill in the required values.
4. Copy `client/.env.example` to `client/.env` and set the local API and server URLs.
5. Start the backend with `node server/index.js`.
6. Start the frontend with `npm run dev --prefix client`.

The exact environment values are deployment-specific. Never commit `.env` files or credentials.

## Common commands

```sh
npm run build
npm run dev --prefix client
npm run lint --prefix client
```

The root build creates the frontend production bundle and prepares it for the server. Run checks from the directory that owns the relevant package script.

## Change guidelines

- Preserve existing API paths and response shapes unless a migration is explicitly planned.
- Prefer small, reversible changes that can be deployed independently.
- Add or update documentation when setup, configuration, or ownership changes.
- Keep secrets, uploaded files, build output, and local environment files out of Git.

See [`AGENTS.md`](./AGENTS.md), [`docs/architecture.md`](./docs/architecture.md), and [`docs/development.md`](./docs/development.md) for the working rules.
