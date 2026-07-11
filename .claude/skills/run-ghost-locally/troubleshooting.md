# Troubleshooting local Ghost

## `yarn dev` fails immediately / weird module errors after `yarn main`

Dependencies are likely out of sync after pulling `main` or switching branches. Fix with:

```bash
yarn fix
```

This cleans the yarn cache, removes all `node_modules`, reinstalls, and resets the Nx cache.
It is slow but resolves most "cannot find module" / version-mismatch problems.

## Docker / MySQL problems

The default setup runs MySQL in Docker. If setup or startup fails with database connection
errors:

1. Confirm Docker is running: `docker info`.
2. Inspect / reset the MySQL container:
   ```bash
   yarn docker:mysql     # open a MySQL CLI against the dev DB
   yarn docker:reset     # tear down volumes and recreate (DELETES DATA)
   ```
3. Confirm `ghost/core/config.local.json` has a `database` block pointing at
   `127.0.0.1:3306`, user `root`, password `root`, db `ghost`. `yarn setup` writes this
   automatically; if it's missing, re-run `yarn setup`.

To switch from Docker MySQL to a locally-installed MySQL, stop the Docker DB and remove the
`database` block from `config.local.json` (the setup script then treats MySQL as local).

## Port already in use

Ghost uses `2368` by default; the frontend dev servers use ports like `4173`, `4175`, `4177`,
`4178`, `6174`, `7173`. If a port is taken, find and stop the process holding it, or change the
Ghost port via `ghost/core/config.local.json` (`server.port`).

## Migrations out of date

If Ghost refuses to boot because the database is behind the schema:

```bash
yarn knex-migrator migrate
```

To fully rebuild the schema and reseed:

```bash
yarn reset:data
```

## Nx cache weirdness / stale builds

```bash
yarn nx reset       # clear the Nx cache
yarn build:clean    # clean build artifacts and rebuild
```

## Nuclear option

If the working tree is deeply broken:

```bash
yarn fix            # clean deps + reinstall + reset nx
yarn setup          # re-run first-time setup (will offer to reset the DB)
```
