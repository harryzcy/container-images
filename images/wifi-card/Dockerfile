FROM node:26.3.0-bookworm@sha256:076dd90a458a4baf8b8d2716f022a2c8db245dbe70c7de38bacad1708258eeab AS builder

# renovate: datasource=git-refs depName=wifi-card packageName=https://github.com/bndw/wifi-card
ENV VERSION="2ab81537fc2b4796395295c0765b6552cbe2e298"

RUN apt-get update && apt-get install -y --no-install-recommends git
RUN git clone --depth 1 https://github.com/bndw/wifi-card.git

WORKDIR /wifi-card
RUN git fetch --depth 1 origin "${VERSION}" && \
  git checkout "${VERSION}" && \
  git rev-parse --short HEAD > /VERSION && \
  npm install -g corepack && \
  yarn set version stable && \
  yarn && yarn build

FROM busybox:1.38.0@sha256:fd8d9aa63ba2f0982b5304e1ee8d3b90a210bc1ffb5314d980eb6962f1a9715d AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.30@sha256:3a262d970b0b639f7f7562f7d0a83c18e7d32ea374a30466dc3138c4b2e1fa02

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/build /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
