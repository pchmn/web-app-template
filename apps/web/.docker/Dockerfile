# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.13.0

FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME="/pnpm"
ENV TURBO_CACHE_DIR="/.turbo"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack enable
RUN pnpm config set store-dir ${PNPM_HOME}

FROM base AS build
# ARG VITE_TRANSLATIONS_HASH
# ENV VITE_TRANSLATIONS_HASH=$VITE_TRANSLATIONS_HASH
ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
ARG APP_VERSION_DATE
ENV APP_VERSION_DATE=$APP_VERSION_DATE
ARG VITE_APP_ENV
ENV VITE_APP_ENV=$VITE_APP_ENV
ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=$VITE_SERVER_URL
WORKDIR /app
COPY . /app/
RUN --mount=type=cache,target=${PNPM_HOME} \
    pnpm install --frozen-lockfile
RUN --mount=type=cache,target=${TURBO_CACHE_DIR} \
    pnpm turbo build --filter=@web-app-template/web
RUN --mount=type=cache,target=${PNPM_HOME} \
    pnpm --filter=@web-app-template/web --prod deploy /prod --legacy

FROM base AS production
WORKDIR /app
COPY --from=build /prod /app
EXPOSE 8080
CMD [ "pnpm", "start" ]