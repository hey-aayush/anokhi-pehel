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

## Public applications and contact

The public mentor form posts to `POST /api/v1/user/mentorApplications` while `isAcceptingResponse` is true. Submission creates a pending application, returns its `applicationId`, and emails that ID when SMTP is configured. If email delivery fails, the ID remains visible on the confirmation screen. The applicant's password is stored as a hash in the application and becomes their login password after activation.

Reviewers open **Mentors → Applications** at `/mentors/applications`, then open `/mentors/applications/:applicationId`. An admin moves an application from Pending → In review → Interviewed. Active Final Year Coordinator and Alumni accounts cast qualifying votes; three distinct qualifying votes move it to Approved. Active Coordinator accounts may cast supporting votes, which do not count toward the three. An admin then activates the account. The existing admin-only `POST /createUser` and legacy inactive mentor management remain available. See [migration plan](docs/mentor-application-migration.md).

The contact form posts to `POST /api/v1/user/contact`. Set `email` and `password` in `server/.env` for the existing SMTP transport. Set `CONTACT_EMAIL` to the inbox for contact messages, or leave it unset to use `email`. Both public POST endpoints are rate limited to five requests per IP per hour.
For a local SMTP inbox, set `SMTP_HOST`, `SMTP_PORT`, and `SMTP_AUTH=false`; the default remains authenticated Gmail SMTP. `SMTP_SECURE=true` enables implicit TLS when the SMTP server requires it.

## Checks

```sh
npm run test:client
npm run test:server
npm run lint --prefix client
npm run validate:server
npm run build
```

`npm run build` creates `client/dist`; the Express server serves it in production. See [AGENTS.md](AGENTS.md) for agent rules, [docs/architecture.md](docs/architecture.md) for code ownership and API/cache contracts, and [docs/development.md](docs/development.md) for verification and delivery guidance. The [client README](client/README.md) contains frontend-specific commands.
