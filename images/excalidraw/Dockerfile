FROM node:22.14.0-bookworm@sha256:f6b9c31ace05502dd98ef777aaa20464362435dcc5e312b0e213121dcf7d8b95 AS build

ARG VERSION=v0.18.0
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000

RUN yarn build:app:docker

FROM nginx:1.27.4@sha256:9d6b58feebd2dbd3c56ab5853333d627cc6e281011cfd6050fa4bcf2072c9496

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot
USER nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
