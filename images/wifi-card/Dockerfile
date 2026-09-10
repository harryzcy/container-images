FROM library/node:26.8.2-trixie@sha256:fb192b8ad31841aadc4bb79c44ae0f59d193a798ffbc9fdce37ba6ecb20c2236 AS builder

# renovate: datasource=git-refs depName=wifi-card packageName=https://github.com/bndw/wifi-card ref=master
ENV VERSION="a51f5d56684c0809ec7af4654dbb44d149c8e999"

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

FROM busybox:1.38.0@sha256:dc2d74b28e4cf8984fa52af1f39bc7c3d9c73760b41a74d629f5d11b1ab28616 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.30@sha256:679387908ea95d6d8de12952cd15d6b351258054a992d2106d3b6aa12659d87d

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/dist /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
