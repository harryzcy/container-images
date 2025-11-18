FROM debian:13.2@sha256:eb37f58646a901dc7727cf448cae36daaefaba79de33b5058dab79aa4c04aefb AS builder

ARG TARGETARCH

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl ca-certificates

# renovate: datasource=github-tags depName=yt-dlp packageName=yt-dlp/yt-dlp versioning=semver
ENV VERSION="2025.11.12"

RUN echo "$VERSION" > /VERSION

RUN if [ "${TARGETARCH}" = "amd64" ]; then \
  filename="yt-dlp_linux"; \
  elif [ "$TARGETARCH" = "arm64" ]; then \
  filename="yt-dlp_linux_aarch64"; \
  else \
  echo "Unsupported architecture: $TARGETARCH" >&2; exit 1; \
  fi && \
  curl -L "https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/${filename}" -o /bin/yt-dlp && \
  chmod +x /bin/yt-dlp

FROM gcr.io/distroless/base-nossl-debian13:nonroot@sha256:41f8c3a5cba400c2eeca6d8f74e74453d93019763366dda0b49efdf6f70b34b0

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/yt-dlp /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/yt-dlp"]
