FROM node:22.15.0-bookworm@sha256:473b4362b26d05e157f8470a1f0686cab6a62d1bd2e59774079ddf6fecd8e37e AS build

ARG VERSION=v0.18.0
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000

RUN yarn build:app:docker

FROM nginx:1.28.0@sha256:9334faa48d730571746a7baab46d62896cb685502bc29d270c4495e26fc78afd

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/excalidraw-app/build /usr/share/nginx/html

ARG VERSION=v0.18.0
RUN echo "${VERSION}" > /VERSION

USER nonroot

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
