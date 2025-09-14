FROM debian:13.1@sha256:833c135acfe9521d7a0035a296076f98c182c542a2b6b5a0fd7063d355d696be AS builder

ARG TARGETARCH

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl ca-certificates

# renovate: datasource=github-tags depName=yt-dlp packageName=yt-dlp/yt-dlp versioning=semver
ENV VERSION="2025.09.05"

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

FROM gcr.io/distroless/base-nossl-debian12:nonroot@sha256:a1922debbf4ff2cc245d7c0d1e2021cfcee35fe24afae7505aeec59f7e7802f6

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/yt-dlp /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/yt-dlp"]
