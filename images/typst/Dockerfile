FROM library/rust:1.99.1-alpine3.24@sha256:27cd9befd4a05d6f6eb407c3e28365f5092f008bfc5946207cca76ae5179ef23 AS builder

# renovate: datasource=github-tags depName=typst packageName=typst/typst versioning=semver digest=commit
ENV VERSION="v0.15.1"
ENV COMMIT="9dfd3a08500b7896045f907433cf7b4b02434fad"

RUN apk add --no-cache git \
  && git clone --depth 1 --branch "${VERSION}" https://github.com/typst/typst.git \
  && test "$(git -C typst rev-parse HEAD)" = "${COMMIT}"

WORKDIR /typst

RUN apk add --no-cache musl-dev openssl-dev openssl-libs-static clang lld \
  && cargo build --release --locked \
  && echo "$VERSION" > /VERSION

FROM library/alpine:3.24.4@sha256:93b41ef40b1677fce8fcc64ff4af09daddfacf5040afde618bc46c1e2d1cc7d4

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

RUN addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=builder --chown=nonroot:nonroot /typst/target/release/typst /bin/typst
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot
ENTRYPOINT ["/bin/typst"]
