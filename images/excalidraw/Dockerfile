FROM node:22.14.0-bookworm@sha256:4a126f3116c37fbd8583209f13518efa9e9f6efc6bf18917141c6e6d4068fea1 AS build

ARG VERSION=v0.18.0
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000

RUN yarn build:app:docker

FROM nginx:1.27.4@sha256:f921d7b7da156f1f0c0486a77f1229489949d77f49a55fef1f6150c41abf9ff8

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot
USER nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/excalidraw-app/build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
