FROM node:20-alpine as build

LABEL org.opencontainers.image.source=https://github.com/ionaru/webauthn-demo

WORKDIR /app
RUN mkdir -p /app/apps/server

COPY package.json package-lock.json nx.json ./
RUN npm ci

COPY tsconfig.base.json ./
COPY apps/server ./apps/server

RUN npm run build server


FROM node:20-alpine as serve

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist/apps/server /app

CMD ["node", "main.mjs"]
