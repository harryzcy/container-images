FROM node:23.8.0-bookworm@sha256:a182b9b37154a3e11e5c1d15145470ceb22069646d0b7390de226da2548aa2a7 AS build

ARG VERSION=v0.17.3
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --ignore-optional --network-timeout 600000

ARG NODE_ENV=production
RUN yarn build:app:docker

FROM nginx:1.27.4@sha256:a807a4af37edad929136828e1b0ed105831f27e5aeecf542fa0dc0693f9e475d

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot
USER nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
