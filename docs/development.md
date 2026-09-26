# Development guide

## Before changing code

Identify whether the change is frontend, backend, configuration, or documentation work. Find the route, page, model, and shared helper involved before editing. Check the current Git diff so existing work is not overwritten.

## Local configuration

Use the committed templates as the source of configuration names:

- `server/.env.example` for database, port, email, and Google integration values.
- `client/.env.example` for browser-visible API and asset URLs.

Local `.env` files are ignored and must never contain values copied into source code.

## Verification levels

For documentation-only changes, inspect the diff and links. For client changes, run the client lint and build. For server changes, start with the server's available checks and exercise the affected endpoint where practical. Shared authentication, routing, configuration, and model changes require a broader smoke test before deployment.

## Production-safe delivery

Keep each deployment focused on one compatibility-preserving concern. Deploy configuration changes before consumers that depend on them, use feature flags or dual-read/dual-write behavior for data migrations, and retain a rollback path. Do not combine a large file reorganization with a behavioral change unless the release can be isolated and verified.

## Documentation expectations

Record new environment variables, API contract changes, migration steps, operational commands, and known verification gaps. Keep explanations close to the relevant module or in `docs/`; do not add large comments that repeat obvious code.
