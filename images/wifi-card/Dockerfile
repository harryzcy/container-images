FROM node:24.7.0-bookworm@sha256:701c8a634cb3ddbc1dc9584725937619716882525356f0989f11816ba3747a22 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends git
RUN git clone --depth 1 https://github.com/bndw/wifi-card.git

WORKDIR /wifi-card
RUN git checkout fbde2cd27669ac29e1c0bc9393f9a83ffa93f8c6 && \
  git rev-parse --short HEAD > /VERSION && \
  yarn && yarn build

FROM busybox:1.37.0@sha256:ab33eacc8251e3807b85bb6dba570e4698c3998eca6f0fc2ccb60575a563ea74 AS health

FROM ghcr.io/nginx/nginx-unprivileged:1.29.1@sha256:ad78b4a52a68a93aa3490260e0bf7b3afd35689d312f22bb28300fbe43a158e5

USER nginx

COPY --from=builder --chown=nginx:nginx /wifi-card/build /usr/share/nginx/html
COPY --from=builder --chown=nginx:nginx /VERSION /VERSION
COPY --from=health --chown=nginx:nginx /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1
