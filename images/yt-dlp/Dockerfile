FROM debian:13.1@sha256:833c135acfe9521d7a0035a296076f98c182c542a2b6b5a0fd7063d355d696be AS builder

ARG TARGETPLATFORM

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl ca-certificates

ENV VERSION="2025.09.05"

RUN echo "$VERSION" > /VERSION

RUN if [ "$TARGETARCH" == "linux/amd64"* ]; then \
  filename="yt-dlp_linux"; \
  elif [ "$TARGETARCH" == "linux/arm64"* ]; then \
  filename="yt-dlp_linux_aarch64"; \
  else \
  echo "Unsupported architecture: $TARGETARCH" >&2; exit 1; \
  fi && \
  curl -L "https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/${filename}" -o /bin/yt-dlp && \
  chmod +x /bin/yt-dlp

FROM gcr.io/distroless/base-nossl-debian12:nonroot

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/yt-dlp /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/yt-dlp"]
