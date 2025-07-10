FROM node:24.4.0-bookworm@sha256:e7db48bc35ee8d2e8d1511dfe779d78076966bd101ab074ea2858da8d59efb7f AS build

ARG VERSION=v0.18.0
RUN git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000

RUN yarn build:app:docker

FROM nginx:1.29.0@sha256:93230cd54060f497430c7a120e2347894846a81b6a5dd2110f7362c5423b4abc

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot

COPY --from=build --chown=nonroot:nonroot /excalidraw/excalidraw-app/build /usr/share/nginx/html

ARG VERSION=v0.18.0
RUN echo "${VERSION}" > /VERSION

USER nonroot

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
