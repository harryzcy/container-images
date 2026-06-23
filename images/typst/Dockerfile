FROM library/rust:1.96.0-alpine3.23@sha256:5dc2af9dd547c33f64d5fc1d299ab93b51f39eaa16c426c476b990ce6caf5b3e AS builder

# renovate: datasource=github-tags depName=typst packageName=typst/typst versioning=semver
ENV VERSION="v0.15.0"

RUN apk add --no-cache git \
  && git clone --depth 1 --branch "${VERSION}" https://github.com/typst/typst.git

WORKDIR /typst

RUN apk add --no-cache musl-dev openssl-dev openssl-libs-static clang lld \
  && cargo build --release \
  && echo "$VERSION" > /VERSION

FROM library/alpine:3.24.1@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

RUN addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=builder --chown=nonroot:nonroot /typst/target/release/typst /bin/typst
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot
ENTRYPOINT ["/bin/typst"]
