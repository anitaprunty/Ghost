---
name: Run Ghost locally
description: Set up and run Ghost for local development from source, including first-time setup, starting the dev servers, resetting data, and common troubleshooting. Use when the user wants to get Ghost up and running locally, start the dev environment, or fix a broken local setup.
---

# Run Ghost Locally

This skill gets a source checkout of Ghost running for local development so you can start
coding right away. It covers the two supported dev workflows, first-time setup, and how to
verify everything is working.

## Prerequisites

Check these before doing anything else:

1. **Node.js** must satisfy `^22.13.1` (see `ghost/core/package.json` `engines`). Check with `node -v`.
   If it's wrong, ask the user to install/switch (e.g. `nvm install 22 && nvm use 22`).
2. **Yarn v1** is the package manager (NOT npm). Check with `yarn -v` (should be `1.x`).
3. **Docker** must be installed and running — the default local setup runs MySQL (and, for
   `yarn dev:forward`, Redis, Mailpit, and Caddy) in Docker. Check with `docker info`.

If any prerequisite is missing, stop and tell the user exactly what to install rather than
guessing around it.

## Choosing a workflow

There are two supported ways to run Ghost locally. Pick based on what the user asks for:

- **`yarn dev` (default, recommended for most work):** Ghost backend + Admin + admin-x apps
  run directly on the host with hot reload. MySQL runs in Docker. Fastest inner loop for
  backend/admin work.
- **`yarn dev:forward` (hybrid Docker):** Ghost Core + MySQL + Redis + Mailpit + Caddy run in
  Docker; frontend dev servers run on the host. Use when the user specifically wants the full
  Docker-backed setup (e.g. mirroring CI, needing Mailpit/Redis).

Default to `yarn dev` unless the user says otherwise.

## First-time setup

Run once per fresh checkout (or when the user wants to reset their environment). Run from the
repo root:

1. `yarn setup`

   This runs `yarn install`, initializes git submodules, and then runs the setup script
   (`.github/scripts/setup.js`), which:
   - Spins up MySQL in Docker and writes the MySQL connection into
     `ghost/core/config.local.json` (host `127.0.0.1`, user `root`, password `root`, db `ghost`).
   - Runs `knex-migrator init` to create the schema.
   - Seeds development data (`yarn reset:data` → 1000 members, 100 posts).

   Note: if MySQL is already configured locally (not via Docker), the script will detect it and
   skip the Docker reset. It may prompt to reset an existing Docker container (this deletes all
   data) — pass `-y`/`-n` to answer non-interactively.

2. (Optional) Build once if you plan to run production-style or need built assets:
   `yarn build`. Not required for `yarn dev`, which builds/watches as it runs.

## Running the dev environment

From the repo root:

```bash
yarn dev
```

This starts, concurrently:
- Ghost backend (`nx run ghost:dev`)
- Ghost Admin (Ember) with live reload
- admin-x apps (`admin-x-settings`, `activitypub`, `posts`, `stats`) + their shared deps in watch mode

### Useful flags

`yarn dev` accepts app flags (passed as `--flag` or via `GHOST_DEV_APP_FLAGS`):

- `yarn dev --portal` — also run Portal
- `yarn dev --comments` — also run Comments UI
- `yarn dev --search` — also run Sodo Search
- `yarn dev --signup` — also run Signup Form
- `yarn dev --announcement-bar` — also run Announcement Bar
- `yarn dev --all` — run everything (all public apps)
- `yarn dev --ghost` — run ONLY the backend
- `yarn dev --admin` — run ONLY Admin + admin-x apps
- `yarn dev --stripe` — forward Stripe webhooks (requires Stripe CLI login or `STRIPE_SECRET_KEY`)
- `yarn dev --show-flags` — list all available flags
- `yarn dev:debug` — same as `yarn dev` with `DEBUG=@tryghost*,ghost:*` enabled

For the hybrid Docker workflow instead:

```bash
yarn dev:forward          # Docker backend + host frontends
yarn dev:analytics        # + Tinybird analytics
yarn dev:storage          # + MinIO S3-compatible storage
yarn dev:all              # + all optional services
```

## Verifying it works

Once the dev servers are up:

- **Site:** http://localhost:2368
- **Admin:** http://localhost:2368/ghost (first visit prompts you to create the owner account)
- **Mailpit** (only with `yarn dev:forward`): http://localhost:8025

When running `yarn dev` yourself in a background/non-interactive context, wait for the Ghost
process to log that it's listening on port 2368 before assuming success. Because the dev
command is long-running, start it in a background terminal (e.g. tmux) rather than blocking.

## Resetting / seeding data

From the repo root:

- `yarn reset:data` — clear DB and seed 1000 members + 100 posts (seed `123`)
- `yarn reset:data:empty` — clear DB with no members/posts
- `yarn knex-migrator migrate` — run pending migrations without wiping data

## Troubleshooting

See [troubleshooting.md](troubleshooting.md) for common failures (dependency mismatches after
`yarn main`, Docker/MySQL issues, port conflicts, Nx cache problems) and how to fix them.
