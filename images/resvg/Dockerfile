FROM debian:13.7@sha256:9c6e381421d0f48d1b8133e573f33c185ee16cbf505eda9c4a8a4791b25ea8a6 AS builder

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
ENV VERSION="v0.49.0"
ENV SHA256="216637e75e909e53e3098b0875cd5f7da2fdc8b4359771b4a29b539afff9d3f5"

RUN echo "$VERSION" > /VERSION

RUN curl --fail --show-error --location --proto '=https' --tlsv1.2 --retry 3 --retry-all-errors \
  "https://github.com/linebender/resvg/releases/download/$VERSION/resvg-linux-x86_64.tar.gz" -o /tmp/resvg.tar.gz \
  && echo "$SHA256  /tmp/resvg.tar.gz" | sha256sum -c - \
  && tar -xzf /tmp/resvg.tar.gz -C /bin/ \
  && rm /tmp/resvg.tar.gz

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:cb87acc574abe719b6e5c547384defa2f7b1f24af9605d3f618cf852495d8be2

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
