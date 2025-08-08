FROM node:24.5.0-bookworm@sha256:dd5c5e4d0a67471a683116483409d1e46605a79521b000c668cff29df06efd51 AS build

ARG VERSION=v0.18.0
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000

RUN yarn build:app:docker

FROM nginx:1.29.0@sha256:84ec966e61a8c7846f509da7eb081c55c1d56817448728924a87ab32f12a72fb

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/excalidraw-app/build /usr/share/nginx/html

ARG VERSION=v0.18.0
RUN echo "${VERSION}" > /VERSION

USER nonroot

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
