FROM debian:13.6@sha256:f324c7ff54321e8d9c588493a20244965938ce0aa50bbd1022d38010e9ffc4b1 AS builder

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

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:d97bc0a941b8d4be647dc0ee75b264ddbb772f1ac5ba690a4309c00723b23775

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
