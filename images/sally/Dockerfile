FROM golang:1.25.5@sha256:a22b2e6c5e753345b9759fba9e5c1731ebe28af506745e98f406cc85d50c828e AS builder

# renovate: datasource=github-tags depName=sally packageName=uber-go/sally versioning=semver
ENV VERSION="v1.6.0"

RUN CGO_ENABLED=0 go install -ldflags="-w -s" "go.uber.org/sally@${VERSION}"
RUN echo "$VERSION" > /VERSION

FROM busybox:1.37.0@sha256:d80cd694d3e9467884fcb94b8ca1e20437d8a501096cdf367a5a1918a34fc2fd AS health

FROM gcr.io/distroless/base:nonroot@sha256:cd961bbef4ecc70d2b2ff41074dd1c932af3f141f2fc00e4d91a03a832e3a658

COPY --from=builder --chown=nonroot:nonroot /go/bin/sally /bin/
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["/bin/sally"]
