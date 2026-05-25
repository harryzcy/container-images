FROM node:26.2.0-bookworm@sha256:818a9b77b5ac86f6169369dc648703d4b6cc4535b4a82e3dd081ad64c498ff26 AS build

# renovate: datasource=github-tags depName=excalidraw packageName=excalidraw/excalidraw versioning=semver
ENV VERSION="v0.18.1"
RUN echo "${VERSION}" > /VERSION && \
  git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000 && \
  yarn build:app:docker

FROM busybox:1.38.0@sha256:fd8d9aa63ba2f0982b5304e1ee8d3b90a210bc1ffb5314d980eb6962f1a9715d AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.30@sha256:02e2892ee192efbc768b01dd6496acf3659301019eb641bfdfbf2d6d570fb9f7

USER nginx

COPY --from=build --chown=nginx:nginx /excalidraw/excalidraw-app/build /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
