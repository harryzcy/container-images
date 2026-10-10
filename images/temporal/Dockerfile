FROM --platform=$BUILDPLATFORM library/alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6 AS clone

# renovate: datasource=github-tags depName=temporal packageName=temporalio/temporal versioning=semver digest=commit
ENV VERSION="v1.32.0"
ENV COMMIT="d94e34a1ebba5410a2e7d07119a76896909591aa"

WORKDIR /app

RUN echo "${VERSION}" > /VERSION && \
  apk add --no-cache git && \
  git clone --depth 1 --branch "${VERSION}" https://github.com/temporalio/temporal.git && \
  test "$(git -C temporal rev-parse HEAD)" = "${COMMIT}"

FROM --platform=$BUILDPLATFORM library/golang:1.27.2-alpine3.24@sha256:85dc1069ac644ea3c527b177303a406eb3358192816cd7f9e5848eb658851673 AS build

ARG TARGETARCH
ARG TARGETOS

WORKDIR /app

ENV CGO_ENABLED=0
ENV GOTOOLCHAIN=local

COPY --from=clone /app/temporal ./temporal

RUN cd temporal && \
  go mod download && \
  go mod verify && \
  GOOS=$TARGETOS GOARCH=$TARGETARCH go build -tags disable_grpc_modules -trimpath -ldflags="-w -s" -o /go/bin/temporal-server ./cmd/server && \
  GOOS=$TARGETOS GOARCH=$TARGETARCH go build -tags disable_grpc_modules -trimpath -ldflags="-w -s" -o /go/bin/temporal-sql-tool ./cmd/tools/sql

FROM library/alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6 AS temporal

RUN apk add --no-cache ca-certificates tzdata && update-ca-certificates && \
  addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=build /go/bin/temporal-server /go/bin/temporal-sql-tool /usr/local/bin/
COPY --from=clone --chmod=755 /app/temporal/docker/scripts/sh/entrypoint.sh /etc/temporal/entrypoint.sh
COPY --from=clone /app/temporal/schema /etc/temporal/schema
COPY --from=clone /VERSION /VERSION

WORKDIR /etc/temporal
USER nonroot

# Frontend gRPC: 7233
# Frontend HTTP: 7243
EXPOSE 7233 7243
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -q -O /dev/null "http://$(getent hosts "$(hostname)" | awk '{print $1}'):7243/api/v1/system-info" || exit 1

CMD ["/etc/temporal/entrypoint.sh"]
