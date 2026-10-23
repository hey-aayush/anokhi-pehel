# Anokhi Pehel

React/Vite frontend and Express/Mongoose API for participants, events, attendance, mentors, and programme data.

## Run locally

Requires Node.js 18+, npm, and MongoDB. From the repository root:

```sh
npm install                  # root install script also installs client and server packages
cp server/.env.example server/.env
# Set DB_URL and JWT_SECRET in server/.env; leave PORT unset for the 8080 default.
cp client/.env.example client/.env
npm start                    # terminal 1: Express at http://localhost:8080
npm run dev --prefix client  # terminal 2: Vite at http://localhost:5173
```

The [client env example](client/.env.example) points API calls and uploaded images to the local server. If `client/.env` is omitted, API calls use Vite's proxy to port 8080, while image URLs use the deployed origin. Never commit `.env` files. The API health endpoint is `/health`.

## Checks

```sh
npm run test:client
npm run test:server
npm run lint --prefix client
npm run validate:server
npm run build
```

`npm run build` creates `client/dist`; the Express server serves it in production. See [AGENTS.md](AGENTS.md) for agent rules, [docs/architecture.md](docs/architecture.md) for code ownership and API/cache contracts, and [docs/development.md](docs/development.md) for verification and delivery guidance. The [client README](client/README.md) contains frontend-specific commands.
