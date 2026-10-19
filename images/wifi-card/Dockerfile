FROM library/node:26.12.0-trixie@sha256:1b84b89ada025e3b14543cbb837ffaa1c1b5273b841c5b94dd1a8f9c1d8cf7fe AS builder

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

FROM ghcr.io/nginx/nginx-unprivileged:1.31@sha256:09b0d3eda2aa592d2487f284519419015cab010d7df16cd0fe224b585fc60eb6

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/dist /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
