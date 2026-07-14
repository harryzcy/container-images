FROM golang:1.26.5@sha256:079e59808d2d252516e27e3f3a9c003740dee7f75e55aa71528766d52bcfc16a AS builder

# renovate: datasource=github-tags depName=sally packageName=uber-go/sally versioning=semver
ENV VERSION="v1.6.0"

RUN CGO_ENABLED=0 go install -ldflags="-w -s" "go.uber.org/sally@${VERSION}"
RUN echo "$VERSION" > /VERSION

FROM busybox:1.38.0@sha256:fd8d9aa63ba2f0982b5304e1ee8d3b90a210bc1ffb5314d980eb6962f1a9715d AS health

FROM gcr.io/distroless/base:nonroot@sha256:97b9d04bed1c754b756c3c4b6a04915c22fb0b5d96a59944eb3bf78c26e6e157

COPY --from=builder --chown=nonroot:nonroot /go/bin/sally /bin/
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["/bin/sally"]
