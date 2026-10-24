# Agent guide

Read the nearest package, target files, callers, and current diff before editing. Open [architecture](docs/architecture.md) or [development](docs/development.md) only when needed.

## Map

- `client/src/App.jsx`: routes; `client/src/Service/`: API helpers; `client/src/queries/`: cache keys and invalidation.
- `server/routers/`: routes; `server/controller/`: handlers; `server/models/`: persistence.

## Rules

- Preserve production behavior and API contracts. Changing URLs, auth, database fields, upload paths, or response shapes requires an explicit migration plan.
- Preserve dirty-worktree changes. Stay within the requested layer; make small patches without unrelated formatting.
- Reuse helpers. Keep routing, validation, business logic, and persistence separate. Use environment variables for deployment configuration. Handle errors at boundaries; remove debug logs.
- Never commit secrets, `.env`, `dist/`, uploads, or dependencies. Update docs for changed commands, configuration, contracts, or boundaries.

## Verify

Run focused checks first; broaden for shared code. Client: `npm run lint --prefix client` and `npm run build`; changed behavior: `npm run test:client` or `npm run test:server`; server JavaScript: `npm run validate:server`. For docs-only changes, check links, commands, and diff. Report missing dependencies rather than installing or changing lockfiles for an unrelated task. State compatibility risk in the summary.
