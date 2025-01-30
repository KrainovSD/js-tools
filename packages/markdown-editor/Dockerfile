FROM node:20.15.0-slim as build

WORKDIR /app

RUN npm i -g pnpm@9.4.0

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.node.json ./tsconfig.node.json
COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./vite.config.ts ./vite.config.ts
COPY ./index.html ./index.html

COPY ./src src/
RUN pnpm build:dev


FROM nginx:1.13-alpine

ENV NODE_TLS_REJECT_UNAUTHORIZED=0
EXPOSE 80

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /app

