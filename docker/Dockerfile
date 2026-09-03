FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# Copy the complete workspace
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the API
RUN pnpm --filter @devlaunch/api build

ENV NODE_ENV=production

EXPOSE 4000

CMD ["node", "apps/api/dist/server.js"]