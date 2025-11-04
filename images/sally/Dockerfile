FROM golang:1.25.3@sha256:0afe9b553123ec160b8282154b7156241ebf43c9033ea2bf9528c6c58c17e89d AS builder

# renovate: datasource=github-tags depName=sally packageName=uber-go/sally versioning=semver
ENV VERSION="v1.6.0"

RUN CGO_ENABLED=0 go install -ldflags="-w -s" "go.uber.org/sally@${VERSION}"
RUN echo "$VERSION" > /VERSION

FROM busybox:1.37.0@sha256:e3652a00a2fabd16ce889f0aa32c38eec347b997e73bd09e69c962ec7f8732ee AS health

FROM gcr.io/distroless/base:nonroot@sha256:10136f394cbc891efa9f20974a48843f21a6b3cbde55b1778582195d6726fa85

COPY --from=builder --chown=nonroot:nonroot /go/bin/sally /bin/
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["/bin/sally"]
