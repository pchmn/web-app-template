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
WORKDIR /app
COPY . /app/
RUN --mount=type=cache,target=${PNPM_HOME} \
    pnpm install --frozen-lockfile
RUN --mount=type=cache,target=${TURBO_CACHE_DIR} \
    pnpm turbo build --filter=@web-app-template/server
RUN --mount=type=cache,target=${PNPM_HOME} \
    pnpm --filter=@web-app-template/server --prod deploy /prod --legacy

FROM base AS production
WORKDIR /app
COPY --from=build /prod /app
EXPOSE 3000
CMD [ "pnpm", "start" ]