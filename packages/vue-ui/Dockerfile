FROM node:22.12-slim as build

WORKDIR /app

RUN npm i -g pnpm@9.4.0

ADD package.json package.json
RUN pnpm i

ADD ./nginx.conf ./nginx.conf
ADD ./tsconfig.build.json ./tsconfig.build.json
ADD ./tsconfig.json ./tsconfig.json
ADD ./tsconfig.node.json ./tsconfig.node.json
ADD ./vite.config.ts ./vite.config.ts
ADD ./.storybook ./.storybook
ADD ./public ./public
ADD ./src ./src



RUN pnpm build-storybook


FROM nginx:1.13-alpine

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

EXPOSE 80

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/storybook-static /app
