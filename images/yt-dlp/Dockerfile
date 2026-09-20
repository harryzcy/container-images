FROM debian:13.7@sha256:9cc080028c43b27d2074d63a5f9caf7166d731494965616c1a6d2827a004585c AS builder

ARG TARGETARCH

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl ca-certificates gnupg

# renovate: datasource=github-tags depName=yt-dlp packageName=yt-dlp/yt-dlp versioning=semver
ENV VERSION="2026.03.17"

# Pin the signing key so a forged key alongside a forged signature won't verify.
# To obtain/re-check the fingerprint:
#   curl -sSL https://raw.githubusercontent.com/yt-dlp/yt-dlp/master/public.key | gpg --show-keys
# Cross-check against a second source: https://keys.openpgp.org
ENV SIGNING_FINGERPRINT="AC0CBBE6848D6A873464AF4E57CF65933B5A7581"

RUN echo "$VERSION" > /VERSION

RUN set -eu; \
  fetch() { curl --fail --show-error --location --proto '=https' --tlsv1.2 --retry 3 --retry-all-errors "$@"; }; \
  if [ "${TARGETARCH}" = "amd64" ]; then \
  filename="yt-dlp_linux"; \
  elif [ "$TARGETARCH" = "arm64" ]; then \
  filename="yt-dlp_linux_aarch64"; \
  else \
  echo "Unsupported architecture: $TARGETARCH" >&2; exit 1; \
  fi; \
  cd /tmp; \
  GNUPGHOME="$(mktemp -d)"; export GNUPGHOME; \
  fetch "https://raw.githubusercontent.com/yt-dlp/yt-dlp/${VERSION}/public.key" -o public.key; \
  gpg --batch --import public.key; \
  base="https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}"; \
  fetch "${base}/SHA2-256SUMS" -o SHA2-256SUMS; \
  fetch "${base}/SHA2-256SUMS.sig" -o SHA2-256SUMS.sig; \
  gpg --batch --assert-signer "$SIGNING_FINGERPRINT" --verify SHA2-256SUMS.sig SHA2-256SUMS; \
  fetch "${base}/${filename}" -o "$filename"; \
  grep " ${filename}\$" SHA2-256SUMS | sha256sum -c -; \
  install -m 0755 "$filename" /bin/yt-dlp; \
  rm -rf "$GNUPGHOME" public.key SHA2-256SUMS SHA2-256SUMS.sig "$filename"

FROM gcr.io/distroless/base-nossl-debian13:nonroot@sha256:86554c46a420d507ff2d678fd261ab8691fba4875a20302f38a49e684b42a33f

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/yt-dlp /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/yt-dlp"]
