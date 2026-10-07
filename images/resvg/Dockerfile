FROM debian:13.7@sha256:913f6706df59a68922d1dd08f78c2476560a8d367897200a6005b00e5f67c2d5 AS builder

ARG TARGETARCH

# Upstream publishes no Linux aarch64 asset, so amd64 is the only supported target.
RUN if [ "$TARGETARCH" != "amd64" ]; then \
  echo "Unsupported architecture: $TARGETARCH" >&2; \
  exit 1; \
  fi

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl tar ca-certificates

# No upstream checksum file, so pin the asset digest; Renovate keeps it in sync.
# renovate: datasource=github-release-attachments depName=resvg packageName=linebender/resvg versioning=semver digest=sha256
ENV VERSION="v0.48.1"
ENV SHA256="fa8c26495a187e592c501db15bf9e8a9fdc051d4b2b336b39703d5b59f912b9d"

RUN echo "$VERSION" > /VERSION

RUN curl --fail --show-error --location --proto '=https' --tlsv1.2 --retry 3 --retry-all-errors \
  "https://github.com/linebender/resvg/releases/download/$VERSION/resvg-linux-x86_64.tar.gz" -o /tmp/resvg.tar.gz \
  && echo "$SHA256  /tmp/resvg.tar.gz" | sha256sum -c - \
  && tar -xzf /tmp/resvg.tar.gz -C /bin/ \
  && rm /tmp/resvg.tar.gz

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:e792ab3d241a468a4fd7519ddbbebe66b49b5f365771716ea688ad40b6c6f1c2

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
