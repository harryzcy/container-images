FROM debian:13.7@sha256:4c25275446ca371766b8b093c696782eabce06263fccacb8d5d813b3dc44b308 AS builder

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

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:83b9b50586253821cf63ffcec87d3d94265a093ad30da232039af962dd8f4edf

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
