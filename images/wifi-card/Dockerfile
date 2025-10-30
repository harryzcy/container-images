FROM node:24.11.0-bookworm@sha256:34af25027ee1b8bffd482ba995ec1e577fbd398db87beb4c60b80c2c9c025127 AS builder

# renovate: datasource=git-refs depName=wifi-card packageName=https://github.com/bndw/wifi-card
ENV VERSION="fbde2cd27669ac29e1c0bc9393f9a83ffa93f8c6"

RUN apt-get update && apt-get install -y --no-install-recommends git
RUN git clone --depth 1 https://github.com/bndw/wifi-card.git

WORKDIR /wifi-card
RUN git checkout "${VERSION}" && \
  git rev-parse --short HEAD > /VERSION && \
  yarn && yarn build

FROM busybox:1.37.0@sha256:e3652a00a2fabd16ce889f0aa32c38eec347b997e73bd09e69c962ec7f8732ee AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.29.2@sha256:f7f2bc91670d746d9634fe8f3184d041a512cc9f7ad6afa0cd0b8a5cf27220f5

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/build /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
