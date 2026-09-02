FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json eslint.config.mjs ./
COPY src ./src
COPY scripts ./scripts
COPY migrations ./migrations
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]