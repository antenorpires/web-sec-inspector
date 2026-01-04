# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV="production"

FROM base AS build

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        cmake \
        build-essential \
        node-gyp \
        pkg-config \
        python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

COPY package-lock.json package.json ./
RUN npm install --only=production && \
    npm ci

COPY . .

FROM base

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        curl \
        wget \
        nmap \
        dnsutils \
        whois \
        strace \
        telnet \
        strace \
        sudo && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app
EXPOSE 8080
CMD ["sh", "-c", "npm run start"]