FROM library/node:22.23.2-trixie@sha256:ae3b84a81a94a99f50110663c936ccda31a3bbf1e91bb6b23c638669f777a6f2 AS build

# renovate: datasource=github-tags depName=excalidraw packageName=excalidraw/excalidraw versioning=semver digest=commit
ENV VERSION="v0.18.1"
ENV COMMIT="a2ec2889babf7d2295469c6d90ebe77fae57df84"
RUN echo "${VERSION}" > /VERSION && \
  git clone --depth 1 --branch "${VERSION}" https://github.com/excalidraw/excalidraw.git && \
  test "$(git -C excalidraw rev-parse HEAD)" = "${COMMIT}"

WORKDIR /excalidraw

RUN yarn install --frozen-lockfile --network-timeout 600000 && \
  yarn build:app:docker

FROM busybox:1.38.0@sha256:dc2d74b28e4cf8984fa52af1f39bc7c3d9c73760b41a74d629f5d11b1ab28616 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.30@sha256:679387908ea95d6d8de12952cd15d6b351258054a992d2106d3b6aa12659d87d

USER nginx

COPY --from=build --chown=nginx:nginx /excalidraw/excalidraw-app/build /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
