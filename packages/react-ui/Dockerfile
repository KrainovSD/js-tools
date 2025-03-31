FROM node:22.12-slim as build

WORKDIR /app

RUN npm i -g pnpm@9.4.0

ADD . .
RUN pnpm i
RUN pnpm build-storybook


FROM nginx:1.13-alpine

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

EXPOSE 80

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/storybook-static /app
