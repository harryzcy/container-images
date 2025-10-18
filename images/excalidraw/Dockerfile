FROM node:25.0.0-bookworm@sha256:92a8086f817cfaf95bfca41d2f72382ae64e87389fe865f9b2f06335edb34073 AS build

# renovate: datasource=github-tags depName=excalidraw packageName=excalidraw/excalidraw versioning=semver
ENV VERSION="v0.18.0"
RUN echo "${VERSION}" > /VERSION && \
  git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000 && \
  yarn build:app:docker

FROM busybox:1.37.0@sha256:2f590fc602ce325cbff2ccfc39499014d039546dc400ef8bbf5c6ffb860632e7 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.29.2@sha256:5faa8648305e93ff7b562a7a576d9f8ef8f5ed78d9c28765bb6551fe461f2606

USER nginx

COPY --from=build --chown=nginx:nginx /excalidraw/excalidraw-app/build /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
