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

## Public applications and contact

The public mentor form posts to `POST /api/v1/user/mentorApplications` while `isAcceptingResponse` is true. Submission creates a pending application, returns its `applicationId`, and emails that ID when SMTP is configured. If email delivery fails, the ID remains visible on the confirmation screen. The applicant's password is stored as a hash in the application and becomes their login password after activation.

Reviewers open **Mentors → Applications** at `/mentors/applications`, then open `/mentors/applications/:applicationId`. An admin moves an application from Pending → In review → Interviewed. Active Final Year Coordinator and Alumni accounts cast qualifying votes; three distinct qualifying votes move it to Approved. Active Coordinator accounts may cast supporting votes, which do not count toward the three. An admin then activates the account. The existing admin-only `POST /createUser` and legacy inactive mentor management remain available. See [migration plan](docs/mentor-application-migration.md).

The contact form posts to `POST /api/v1/user/contact`. Set `email` and `password` in `server/.env` for the existing SMTP transport. Set `CONTACT_EMAIL` to the inbox for contact messages, or leave it unset to use `email`. Both public POST endpoints are rate limited to five requests per IP per hour.
For a local SMTP inbox, set `SMTP_HOST`, `SMTP_PORT`, and `SMTP_AUTH=false`; the default remains authenticated Gmail SMTP. `SMTP_SECURE=true` enables implicit TLS when the SMTP server requires it.

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
