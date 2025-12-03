FROM node:20-alpine AS depens
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .

FROM node:20-alpine AS builder
WORKDIR /app
COPY  --from=depens /app/node_modules ./node_modules
COPY --from=depens /app/tsconfig.json ./tsconfig.json
COPY --from=depens /app/package*.json ./
COPY --from=depens /app/src ./src
COPY --from=depens  /app/app.ts ./app.ts
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=depens /app/node_modules ./node_modules
COPY --from=depens /app/package*.json ./
COPY --from=builder /app/dist ./dist
CMD ["node" , "/app.ts"]
