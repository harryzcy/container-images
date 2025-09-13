FROM node:24.8.0-bookworm@sha256:82a1d74c5988b72e839ac01c5bf0f7879a8ffd14ae40d7008016bca6ae12852b AS build

ARG VERSION=v0.18.0
RUN echo "${VERSION}" > /VERSION && \
  git clone --depth 1 --branch ${VERSION} https://github.com/excalidraw/excalidraw.git

WORKDIR /excalidraw

RUN yarn --network-timeout 600000 && \
  yarn build:app:docker

FROM busybox:1.37.0@sha256:ab33eacc8251e3807b85bb6dba570e4698c3998eca6f0fc2ccb60575a563ea74 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.29.1@sha256:ad78b4a52a68a93aa3490260e0bf7b3afd35689d312f22bb28300fbe43a158e5

USER nginx

COPY --from=build --chown=nginx:nginx /excalidraw/excalidraw-app/build /usr/share/nginx/html
COPY --from=build --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
