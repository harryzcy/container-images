FROM library/rust:1.99.1-alpine3.24@sha256:44819b27be4c97b0e4d7203bd2e02c4820f97700211b6a37fb4c246a2de59383 AS builder

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

FROM library/alpine:3.24.4@sha256:f59abe656b692d901e184be3445e084786602108599d2a51d229c0f5a48c71bf

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

RUN addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=builder --chown=nonroot:nonroot /typst/target/release/typst /bin/typst
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot
ENTRYPOINT ["/bin/typst"]
