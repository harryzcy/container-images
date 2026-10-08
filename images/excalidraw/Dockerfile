FROM library/node:22.23.3-trixie@sha256:def2655045ff1ee91b28a48cb3ec84feafef6d128bda0ff6903e7847ed0b27b4 AS build

# renovate: datasource=github-tags depName=excalidraw packageName=excalidraw/excalidraw versioning=semver digest=commit
ENV VERSION="v0.18.1"
ENV COMMIT="a2ec2889babf7d2295469c6d90ebe77fae57df84"
RUN echo "${VERSION}" > /VERSION && \
  git clone --depth 1 --branch "${VERSION}" https://github.com/excalidraw/excalidraw.git && \
  test "$(git -C excalidraw rev-parse HEAD)" = "${COMMIT}"

WORKDIR /excalidraw

RUN yarn install --frozen-lockfile --network-timeout 600000 && \
  yarn build:app:docker

FROM busybox:1.38.0@sha256:fd7dc98638c8e305f4dc34e979f1c0fdfdcaeb0fbf8fcff77ae834b6da3d7e6e AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.31@sha256:ce1317316e272062981736063d4a7eed7d80b0d2a53da1305d0752aa4aee7a48

USER nginx

COPY --from=build --chown=nginx:nginx /excalidraw/excalidraw-app/build /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
