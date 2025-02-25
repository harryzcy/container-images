FROM node:23.8.0-bookworm@sha256:89832d6c472e744355c3751da68d60d8f79bb20a79fe7497672d4099b898a7f4 AS build

ARG VERSION=v0.17.3
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --ignore-optional --network-timeout 600000

ARG NODE_ENV=production
RUN yarn build:app:docker

FROM nginx:1.27.4@sha256:9d6b58feebd2dbd3c56ab5853333d627cc6e281011cfd6050fa4bcf2072c9496

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot
USER nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
