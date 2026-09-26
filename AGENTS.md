# Agent instructions

## Scope

This repository contains a Vite React client and an Express/Mongoose server. Read the nearest package and relevant domain files before editing. Keep changes within the requested layer and avoid unrelated formatting churn.

## Safety rules

- Treat production behavior and existing API contracts as compatibility constraints.
- Do not change URLs, authentication behavior, database fields, upload paths, or response shapes without an explicit migration plan.
- Do not commit secrets, `.env` files, generated `dist/` output, uploaded images, or dependency directories.
- Preserve existing user changes in a dirty worktree.
- Prefer small patches that are easy to review and revert.

## Engineering rules

- Reuse existing helpers and patterns before introducing abstractions.
- Keep route wiring, request validation, business logic, and persistence separate as code is refactored.
- Use environment variables for deployment-specific configuration.
- Handle errors at the boundary and avoid leaving debug logging in production paths.
- Update documentation when a command, configuration value, API contract, or architectural boundary changes.

## Verification

Run the narrowest relevant checks first, then broaden them when shared code changes:

```sh
npm run lint --prefix client
npm run build
```

If dependencies are unavailable, report that explicitly instead of changing lockfiles or installing packages as part of an unrelated refactor.

## Working sequence

1. Inspect the target files and their callers.
2. State the compatibility risk in the change summary.
3. Make the smallest coherent patch.
4. Run focused checks and inspect the final diff.
