# Webauthn-Demo

This is a demo application for the [WebAuthn API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API).

Specification: https://www.w3.org/TR/webauthn-2/

## Workshop presentation slides

https://docs.google.com/presentation/d/1ao0smbzyNDc2hl93o-s_73q5RoxOBZ8cyW-iAG-TDiY/edit?usp=sharing

## Demo

The demo application is available at [https://webauthn-workshop.app](https://webauthn-workshop.app).

## API

### OpenAPI / Swagger

You can find the OpenAPI specification [here](https://webauthn-workshop.app/api).

You can also download the schema in [JSON format](https://webauthn-workshop.app/api-json), and [YAML format](https://webauthn-workshop.app/api-yaml).

### GraphQL

For GraphQL, you can use the [GraphQL Playground](https://webauthn-workshop.app/graphql).

## Useful tools & info

- [Chrome WebAuthn Devtool](https://developer.chrome.com/docs/devtools/webauthn/)

### Type corrections

Typescript doesn't know what kind of data is returned from the WebAuthn API, so we have to correct the types.

```ts
const credential = await navigator.credentials.create(options) as PublicKeyCredential;
```

```ts
// For registration
const response = credential.response as AuthenticatorAttestationResponse;
```

```ts
// For authentication
const response = credential.response as AuthenticatorAssertionResponse;
```

### Utility functions

These function are essential to encode/decode data when communicating with an Authenticator.

```ts
export const toBase64 = (buffer: ArrayBuffer) => btoa(String.fromCodePoint(...new Uint8Array(buffer)));
```

```ts
export const toBuffer = (text: string) => Uint8Array.from(text, (c) => c.codePointAt(0)!).buffer;
```

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

## MongoDB

The application uses a mongoDB database to store the users and sessions.

Use docker to start a mongoDB instance: `docker compose up db`
