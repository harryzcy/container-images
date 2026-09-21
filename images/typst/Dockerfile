FROM library/rust:1.98.1-alpine3.24@sha256:7cc1c22d77d9432f7fe012a70e6d3e555af54c2a6832700ed7d553f1769ae89f AS builder

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

FROM library/alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

RUN addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=builder --chown=nonroot:nonroot /typst/target/release/typst /bin/typst
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot
ENTRYPOINT ["/bin/typst"]
