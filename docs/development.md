# Development guide

## Before changing code

Identify whether the change is frontend, backend, configuration, or documentation work. Find the route, page, model, and shared helper involved before editing. Check the current Git diff so existing work is not overwritten.

## Local configuration

Use the committed templates as the source of configuration names:

- `server/.env.example` for database, port, email, and Google integration values.
- `client/.env.example` for the browser-visible server origin. Use it for local uploaded images; without it, local API calls use Vite's proxy to port 8080 but image URLs use the deployed origin.

Local `.env` files are ignored and must never contain values copied into source code.

## Verification levels

For documentation-only changes, inspect the diff and local links. For client changes, run `npm run lint --prefix client` and `npm run build`, plus `npm run test:client` for changed behavior. For server changes, run `npm run validate:server` and `npm run test:server`, then exercise the affected endpoint where practical. Shared authentication, routing, configuration, and model changes require a broader smoke test before deployment.

## Production-safe delivery

Keep each deployment focused on one compatibility-preserving concern. Deploy configuration changes before consumers that depend on them, use feature flags or dual-read/dual-write behavior for data migrations, and retain a rollback path. Do not combine a large file reorganization with a behavioral change unless the release can be isolated and verified.

For a stacked pull request, branch from the parent PR head and set that branch as the new PR base. Once the parent merges, retarget the child PR to `main` and confirm its diff and checks.

## Documentation expectations

`AGENTS.md` is the canonical short agent guide; `CLAUDE.md` only points to it. Keep setup in the root README, boundaries and contracts in `docs/architecture.md`, and workflow details here. Record new environment variables, API contract changes, migration steps, commands, and verification gaps without repeating obvious code.
