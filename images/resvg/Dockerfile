FROM debian:13.1@sha256:9dfe31addfd4b3cec207690f146f81b0df1b404e2ca08ecd3f6fe29dabf0e455 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl tar ca-certificates

# renovate: datasource=github-tags depName=resvg packageName=linebender/resvg versioning=semver
ENV VERSION="v0.45.1"

RUN echo "$VERSION" > /VERSION

RUN curl -L "https://github.com/linebender/resvg/releases/download/$VERSION/resvg-linux-x86_64.tar.gz" -o /tmp/resvg.tar.gz \
  && tar -xzf /tmp/resvg.tar.gz -C /bin/ \
  && rm /tmp/resvg.tar.gz

FROM gcr.io/distroless/cc-debian12:nonroot@sha256:15b189376c7556cf06fc93a8e3e2879f8555ff253b8c11a3e45dc634f0ac85c7

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
