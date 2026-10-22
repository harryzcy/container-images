FROM library/node:26.12.0-trixie@sha256:45a2bf9d9300e9cf47ecb375e38447c140c45ef5fbae869c430475b05b98d86e AS builder

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

FROM busybox:1.38.0@sha256:fd7dc98638c8e305f4dc34e979f1c0fdfdcaeb0fbf8fcff77ae834b6da3d7e6e AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.31@sha256:df222939af65501ae839eeaa3e9837a4cac224ecc4def63df3b12634220eb5e9

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/dist /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
