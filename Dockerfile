FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY src ./src
COPY server.json LICENSE README.md ./
USER node
ENTRYPOINT ["node", "src/index.mjs"]
