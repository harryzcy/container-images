FROM node:24.7.0-bookworm@sha256:701c8a634cb3ddbc1dc9584725937619716882525356f0989f11816ba3747a22 AS builder

RUN apt-get update && apt-get install -y git
RUN git clone --depth 1 https://github.com/bndw/wifi-card.git

WORKDIR /wifi-card
RUN git checkout fbde2cd27669ac29e1c0bc9393f9a83ffa93f8c6 && \
  git rev-parse --short HEAD > /VERSION
  yarn && yarn build

FROM busybox:1.37.0@sha256:ab33eacc8251e3807b85bb6dba570e4698c3998eca6f0fc2ccb60575a563ea74 AS health

FROM nginx:1.29.1@sha256:33e0bbc7ca9ecf108140af6288c7c9d1ecc77548cbfd3952fd8466a75edefe57

RUN addgroup --system nonroot && useradd --system nonroot -g nonroot

USER nonroot

COPY --from=builder --chown=nonroot:nonroot /wifi-card/build /usr/share/nginx/html
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/

EXPOSE 80
HEALTHCHECK --interval=60s --timeout=30s --start-period=5s --retries=3 \
  CMD [ "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/", "||", "exit", "1" ]
