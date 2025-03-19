FROM node:18-alpine AS base

FROM base AS installer
RUN apk add --no-cache libc6-compat curl
RUN apk update

# Set working directory
WORKDIR /app
COPY . .
COPY .env ./

# First install the dependencies (as they change less often)
RUN npm ci 

# Copy over deps and then build sveltekit
FROM base AS builder
WORKDIR /app
COPY --from=installer /app .
RUN npm run build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltejs
USER sveltejs

COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY .env ./

CMD node build
