FROM library/rust:1.99.1-alpine3.24@sha256:557a94c82b485a14b569120e00867267108c734efe33f10cc31ca0cd5dd1eca9 AS builder

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

FROM library/alpine:3.24.3@sha256:be2656061b536c1883c4034790e21d0a09c5aaaf51968b89368a3c0371ea2c9a

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

RUN addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=builder --chown=nonroot:nonroot /typst/target/release/typst /bin/typst
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot
ENTRYPOINT ["/bin/typst"]
