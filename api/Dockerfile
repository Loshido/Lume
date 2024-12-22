FROM oven/bun:alpine AS build
WORKDIR /app

COPY . .

RUN bun install
RUN bun build /app/src/index.ts --outdir /app/build/ --target bun --sourcemap

FROM oven/bun:alpine AS production
WORKDIR /app

RUN mkdir /data && mkdir /data/media && mkdir /data/logs
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/build/index.js /app/index.js

ENV MEDIA_FOLDER="/data/media"
EXPOSE 80
ENTRYPOINT [ "bun", "run", "/app" ]