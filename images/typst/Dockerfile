FROM library/rust:1.93.0-alpine3.23@sha256:d776c22db3cf28689f145615e7deab6ee7496cfc7d6cdefde3fc050d05e4a4dc AS builder

# renovate: datasource=github-tags depName=typst packageName=typst/typst versioning=semver
ENV VERSION="v0.14.2"

RUN apk add --no-cache git \
  && git clone --depth 1 --branch "${VERSION}" https://github.com/typst/typst.git

WORKDIR /typst

RUN apk add --no-cache musl-dev openssl-dev openssl-libs-static clang lld \
  && cargo build --release \
  && echo "$VERSION" > /VERSION

FROM library/alpine:3.23.3@sha256:eb37f58646a901dc7727cf448cae36daaefaba79de33b5058dab79aa4c04aefb

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

RUN addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=builder --chown=nonroot:nonroot /typst/target/release/typst /bin/typst
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot
ENTRYPOINT ["/bin/typst"]
