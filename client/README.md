# Client

Vite/React frontend. Start from the [root README](../README.md) for API and MongoDB setup.

```sh
npm run dev --prefix client
npm run lint --prefix client
npm run test:client
npm run build
```

Run these commands from the repository root. Copy [`.env.example`](.env.example) to `client/.env` to load API data and uploaded images from the local server. Without it, API requests use the Vite proxy but image URLs use the deployed origin. For route, data, and cache ownership, see [architecture](../docs/architecture.md).
