# Compendium Temple

## Usage

```sh
npm i -g @compendium-temple/cli
compendium
```

## How it works

- CLI checks the latest worker version and automatically updates it
- CLI runs worker
- worker authorizes using github to be able to make requests to public repositories
- workers requests a new task from the server
- worker accomplishes task by making request to GitHub API with user's token
- worker returns response to the server
- server saves data

## Development

### How to start

```shell
npm i -g nx
npm ci
```

### Local Artifactory

[Verdaccio](https://verdaccio.org/docs/what-is-verdaccio) is used for the development to publish packages locally and to test CLI and auto-update.

- `nx verdaccio` - runs Verdaccio at the HTTP port 4873

### Database

Folder: `packages/db`.

This projects uses ORM [Primsa](https://www.prisma.io/docs/getting-started). For local development database is kept under the `packages/db/.data` folder. Schema is kept in the `packages/db/schema.prisma` file.

- `npm run db:start` - run database in the Docker
- `npm run db:reset` - resets all the data in database and recreates tables
- `npm run db:push` - push initial schema to database
- `npm run db:migrate` - create migration for the database
- `npm run db:client` - generate client for the database (runs format and generate tasks)
- `npm run db:client:format` - run schema formatting
- `npm run db:client:generate` - generate client code for the schema
    "db:client:format": "prisma format --schema=packages/db/schema.prisma",
    "db:client:generate": "prisma generate --schema=packages/db/schema.prisma"

### @compendium-temple/cli

Folder: `packages/cli`.

- `nx publish-local cli` - build and publish CLI to the local artifactory and install it globally

CLI runs with `compendium` command. It automatically finds the latest version and updates `@compendium-temple/worker`.

### @compendium-temple/worker

This package contains main part of `@compendium-temple/cli`, which does all the required requests and sends data to the Compendium server.

- `nx publish-local worker` - publish package into Verdaccio

### @compendium-temple/config

This package contains `ConfigService` class to manage local configuration for CLI and Worker. It should save parameters in the user's folder and override them if it is required.

_For some reason we cannot use tsyringe for injections, it may be caused the reason similar to described in [the issue #138 "Container resolve does work anymore with default parameters since v4.4](https://github.com/microsoft/tsyringe/issues/138)_

### Server

Folder: `packages/server`.

- `nx dev server` - run server (development mode)
- `nx build server`
- `nx lint server`
- `nx test server [--watch]` - run unit tests, with `--watch` in the watch mode

## Flow

