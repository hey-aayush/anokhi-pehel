# Architecture

## Current shape

The project is a single repository with two applications:

```text
client (React/Vite) -> HTTP API -> server (Express) -> MongoDB
                                      |-> filesystem uploads
                                      |-> email and Google integrations
```

The server exposes routes below `/api/v1/user`. It also serves uploaded images and, in the production build, serves the frontend bundle. The client currently contains page-level data fetching and shared URL constants.

## Main boundaries

- `client/src/App.jsx` owns route registration. The home page remains eager; dashboard and performance pages load on navigation.
- `client/src/pages/` contains user-facing screens and feature workflows.
- `client/src/components/` contains reusable presentation and interaction components.
- `client/src/Service/` contains current client service helpers.
- Redux owns session and UI state. React Query owns migrated API data; dashboard overview is the first migrated read. `client/src/queries/` owns its query keys and invalidation policy.
- `server/routers/` owns HTTP route registration and currently contains some request and persistence logic.
- `server/controller/` contains server handlers for selected domains.
- `server/models/` contains Mongoose models.
- `server/middlewares/` contains request middleware such as authentication.

## Compatibility constraints

Refactoring should preserve these boundaries until a migration is deliberately completed:

- Existing frontend routes and backend URL paths.
- Authentication token format and authorization headers.
- MongoDB collection names and persisted field names.
- Upload directories and public image URLs.
- Existing response shapes consumed by the client.

## Target direction

Changes should move incrementally toward feature-oriented modules:

```text
feature
  route -> controller -> service -> model
                     |-> validator
                     |-> shared error handling
```

The target structure is guidance for future phases, not a reason to move files in bulk during a production-sensitive change.

## Client cache policy

The dashboard overview is fresh by date for 30 seconds and retained for up to
five minutes after its last use. Successful attendance, topic, or student writes
cancel in-flight overview reads and invalidate every
cached overview date. The mapping is in `client/src/queries/dashboardQueries.js`
and is invoked by the shared Axios response interceptor. Authenticated cached
data is cleared on logout, password change, or session rejection. When adding
another cached read, add every write that can change it to the invalidation
mapping and test an in-flight read that overlaps a write.
