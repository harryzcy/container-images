FROM library/node:26.10.0-trixie@sha256:9965105b7a4e201d7f07268402bb4971670592b46c9b9058cc643961199a1ab6 AS builder

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

FROM busybox:1.38.0@sha256:fd7dc98638c8e305f4dc34e979f1c0fdfdcaeb0fbf8fcff77ae834b6da3d7e6e AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.31@sha256:ce1317316e272062981736063d4a7eed7d80b0d2a53da1305d0752aa4aee7a48

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/dist /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
