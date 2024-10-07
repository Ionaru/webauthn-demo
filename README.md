# Webauthn-Demo

This is a demo application for the [WebAuthn API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API).

## Demo

The demo application is available at [https://webauthn-workshop.app](https://webauthn-workshop.app).

## API

### OpenAPI / Swagger

You can find the OpenAPI specification [here](https://webauthn-workshop.app/api).

You can also download the schema in [JSON format](https://webauthn-workshop.app/api-json), and [YAML format](https://webauthn-workshop.app/api-yaml).

### GraphQL

For GraphQL, you can use the [GraphQL Playground](https://webauthn-workshop.app/graphql).

## Running the app

### Prerequisites (either)

- Node.js 20+
- Docker
- A mongoDB database (see below)

#### Environment variables

- `WD_DB_URL`: The URL of the database (For example `mongodb://root:root@db/`)
- `WD_DB_NAME`: The name of the database
- `WD_SESSION_NAME`: The name of the session
- `WD_SESSION_SECRET`: The secret of the session
- `WD_CLIENT_PORT`: The port of the client

### Running the application using Node.js

- Run `npm ci` to install dependencies
- Run `npm run dev` to run the application
- Open http://localhost:4200 in your browser

### Running the application in Docker

- Run `docker compose up` to start the application
- Open http://localhost:80 in your browser

## Mongo

The application uses a mongoDB database to store the users and sessions.

Use docker to start a mongoDB instance: `docker compose up db`
