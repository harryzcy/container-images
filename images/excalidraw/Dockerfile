FROM library/node:22.23.2-trixie@sha256:2082d2bf902c8835655c6bcfee3594c00ea900498a9f6e2b96d3352536f9e8d8 AS build

# renovate: datasource=github-tags depName=excalidraw packageName=excalidraw/excalidraw versioning=semver
ENV VERSION="v0.18.1"
RUN echo "${VERSION}" > /VERSION && \
  git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000 && \
  yarn build:app:docker

FROM busybox:1.38.0@sha256:dc2d74b28e4cf8984fa52af1f39bc7c3d9c73760b41a74d629f5d11b1ab28616 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.30@sha256:679387908ea95d6d8de12952cd15d6b351258054a992d2106d3b6aa12659d87d

USER nginx

COPY --from=build --chown=nginx:nginx /excalidraw/excalidraw-app/build /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
