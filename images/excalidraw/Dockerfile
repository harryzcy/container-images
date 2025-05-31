FROM node:24.1.0-bookworm@sha256:c332080545f1de96deb1c407e6fbe9a7bc2be3645e127845fdcce57a7af3cf56 AS build

ARG VERSION=v0.18.0
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000

RUN yarn build:app:docker

FROM nginx:1.28.0@sha256:eaa7e36decc3421fc04478c586dfea0d931cebe47d5bc0b15d758a32ba51126f

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/excalidraw-app/build /usr/share/nginx/html

ARG VERSION=v0.18.0
RUN echo "${VERSION}" > /VERSION

USER nonroot

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
