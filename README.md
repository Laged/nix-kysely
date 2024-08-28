# Project Name
Just testing Nix, devenv and stuff. This project is built using Bun, TypeScript, Kysely, and PostgreSQL. The development environment is managed using Devenv, which simplifies the process of setting up, running tests, and starting the main application.

## Prerequisites

- Ensure you have [Devenv](https://devenv.sh/getting-started/) installed.

## Environment Setup

Make sure your `.env` file is correctly configured with the necessary PostgreSQL connection details ie.:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=additions
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}
```

## Running tests
```sh
devenv test
```

## Running service
```sh
devenv shell
bun start
```
