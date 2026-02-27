FROM debian:13.3@sha256:3615a749858a1cba49b408fb49c37093db813321355a9ab7c1f9f4836341e9db AS builder

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

FROM gcr.io/distroless/base-nossl-debian13:nonroot@sha256:ae8c000510097a434f40312990f5a2fabe10e6bcb3343d4bb962ea1c867e3428

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/yt-dlp /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/yt-dlp"]
