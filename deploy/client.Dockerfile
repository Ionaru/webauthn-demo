FROM node:20-alpine as build

LABEL org.opencontainers.image.source=https://github.com/ionaru/webauthn-demo

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.base.json nx.json ./
COPY apps/client ./apps/client

RUN npm run build client


FROM nginx:mainline-alpine as serve

COPY deploy/nginx.conf /etc/nginx/conf.d
RUN mkdir /etc/nginx/conf.d/proxy
COPY deploy/nginx-proxy.conf /etc/nginx/conf.d/proxy
RUN rm /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/apps/client /app
