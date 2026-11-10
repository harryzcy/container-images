FROM library/node:26.13.0-trixie@sha256:438603bbb5cda404b9416f0b5c8026f61501ab911760d861ec28c36b5d675725 AS builder

# renovate: datasource=git-refs depName=wifi-card packageName=https://github.com/bndw/wifi-card ref=master
ENV VERSION="44a1b9aecdea5bf35c2ac23434121432ae5eee56"

# node:26 ships no corepack. Upstream pins packageManager with a sha512, which
# corepack verifies, so the yarn version needs no separate pin here.
# renovate: datasource=npm depName=corepack packageName=corepack
ENV COREPACK_VERSION="0.36.0"

RUN apt-get update && apt-get install -y --no-install-recommends git
RUN git clone --depth 1 https://github.com/bndw/wifi-card.git

WORKDIR /wifi-card
RUN git fetch --depth 1 origin "${VERSION}" && \
  git checkout "${VERSION}" && \
  git rev-parse --short HEAD > /VERSION && \
  npm install -g "corepack@${COREPACK_VERSION}" && \
  corepack enable && \
  yarn install --immutable && \
  yarn build

FROM busybox:1.38.0@sha256:a46257e06c82ad85242d0d38077d0a52d9896389ca60a1a59d3463db586e5fa4 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.31@sha256:e4264279b179f0e654579a90a1a9c1eab3ba9124c17551794bee20f68a38b5ce

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/dist /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
