FROM golang:1.27.4@sha256:5e8afd493a7124a8586e134d9b532731161d4b9becf9dee5a5956b107426f93d AS builder

# renovate: datasource=github-tags depName=sally packageName=uber-go/sally versioning=semver
ENV VERSION="v1.6.0"

RUN CGO_ENABLED=0 go install -ldflags="-w -s" "go.uber.org/sally@${VERSION}"
RUN echo "$VERSION" > /VERSION

FROM busybox:1.38.0@sha256:a46257e06c82ad85242d0d38077d0a52d9896389ca60a1a59d3463db586e5fa4 AS health

FROM gcr.io/distroless/base:nonroot@sha256:a08d9054afbaf1af9b90fd02cdc7b32236319b5376d374505a41548d42b0c5db

COPY --from=builder --chown=nonroot:nonroot /go/bin/sally /bin/
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["/bin/sally"]
