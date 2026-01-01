# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.21.1
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    apt-get update && apt-get install -y --no-install-recommends \
        curl \
        proxychains4 \
        nmap \
        dnsutils \
        tor \
        sudo \
    && rm -rf /var/lib/apt/lists/*

# Install node modules
COPY package-lock.json package.json ./
# RUN npm install --only=production && \
RUN npm ci

# Copy application code
COPY . .

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD [ "service", "tor", "start", "&&", "npm", "run", "start" ]
# CMD [ "npm", "run", "start" ]
