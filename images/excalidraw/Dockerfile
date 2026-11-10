FROM library/node:22.23.4-trixie@sha256:c46850e69b4fab3c4f225aa36b777c8cc001d1cd5b2136e1ea024796f6d3bbbb AS build

# renovate: datasource=github-tags depName=excalidraw packageName=excalidraw/excalidraw versioning=semver digest=commit
ENV VERSION="v0.18.1"
ENV COMMIT="a2ec2889babf7d2295469c6d90ebe77fae57df84"
RUN echo "${VERSION}" > /VERSION && \
  git clone --depth 1 --branch "${VERSION}" https://github.com/excalidraw/excalidraw.git && \
  test "$(git -C excalidraw rev-parse HEAD)" = "${COMMIT}"

WORKDIR /excalidraw

RUN yarn install --frozen-lockfile --network-timeout 600000 && \
  yarn build:app:docker

FROM busybox:1.38.0@sha256:a46257e06c82ad85242d0d38077d0a52d9896389ca60a1a59d3463db586e5fa4 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.31@sha256:e4264279b179f0e654579a90a1a9c1eab3ba9124c17551794bee20f68a38b5ce

USER nginx

COPY --from=build --chown=nginx:nginx /excalidraw/excalidraw-app/build /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
