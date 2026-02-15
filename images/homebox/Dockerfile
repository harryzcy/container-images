# Adapted from https://github.com/sysadminsmedia/homebox/blob/main/Dockerfile.rootless

FROM library/node:25.6.1-alpine3.23@sha256:b9b5737eabd423ba73b21fe2e82332c0656d571daf1ebf19b0f89d0dd0d3ca93 AS clone

WORKDIR /app

# renovate: datasource=github-tags depName=homebox packageName=sysadminsmedia/homebox versioning=semver
ENV VERSION="v0.23.1"

RUN apk update && \
  apk upgrade && \
  apk add --no-cache git && \
  git clone https://github.com/sysadminsmedia/homebox.git && \
  cd homebox && \
  git checkout "$VERSION" && \
  echo "$VERSION" > /VERSION && \
  git rev-parse --short HEAD > /COMMIT

FROM library/node:25.6.1-alpine3.23@sha256:b9b5737eabd423ba73b21fe2e82332c0656d571daf1ebf19b0f89d0dd0d3ca93 AS frontend-builder

WORKDIR /app

COPY --from=clone /app/homebox ./homebox

RUN apk update && \
  apk upgrade && \
  # somehow build fails without git
  apk add --no-cache git && \
  npm install -g pnpm && \
  cd homebox/frontend && \
  pnpm install --frozen-lockfile && \
  pnpm build

FROM library/golang:1.26.0-alpine3.23@sha256:af3e0c6a576a28ca3250bb5c12fdb5e11f62eabc9b96c8bf4e23b0166ee22d80 AS builder

WORKDIR /go/src/app

ARG TARGETOS
ARG TARGETARCH

COPY --from=clone /COMMIT /COMMIT
COPY --from=clone /VERSION /VERSION

RUN VERSION=$(cat /VERSION)
RUN COMMIT=$(cat /COMMIT)
RUN BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

COPY --from=clone /app/homebox ./homebox
RUN cd homebox/backend && go mod download

RUN apk update && \
  apk upgrade && \
  apk add --no-cache git build-base gcc g++ && \
  if [ "$TARGETARCH" != "arm" ]; then apk --no-cache add libwebp libavif libheif libjxl; fi

COPY --from=frontend-builder /app/homebox/frontend/.output/public ./app/homebox/backend/api/static/public

RUN --mount=type=cache,target=/root/.cache/go-build \
  cd homebox/backend && \
  if [ "$TARGETARCH" = "arm" ] || [ "$TARGETARCH" = "riscv64" ];  \
  then echo "nodynamic" $TARGETOS $TARGETARCH; CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build \
  -ldflags "-s -w -X main.commit=$COMMIT -X main.buildTime=$BUILD_TIME -X main.version=$VERSION" \
  -tags nodynamic -o /go/bin/api -v ./app/api/*.go; \
  else \
  echo $TARGETOS $TARGETARCH; CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build \
  -ldflags "-s -w -X main.commit=$COMMIT -X main.buildTime=$BUILD_TIME -X main.version=$VERSION" \
  -o /go/bin/api -v ./app/api/*.go; \
  fi

RUN mkdir /data

FROM library/alpine:3.23.3@sha256:25109184c71bdad752c8312a8623239686a9a2071e8825f20acb8f2198c3f659
ENV HBOX_MODE=production
ENV HBOX_STORAGE_CONN_STRING=file:///?no_tmp_dir=true
ENV HBOX_STORAGE_PREFIX_PATH=data
ENV HBOX_DATABASE_SQLITE_PATH=/data/homebox.db?_pragma=busy_timeout=2000&_pragma=journal_mode=WAL&_fk=1&_time_format=sqlite

# Install necessary runtime dependencies
RUN apk --no-cache add ca-certificates wget && \
  if [ "$TARGETARCH" != "arm" ]; then apk --no-cache add libwebp libavif libheif libjxl; fi

RUN addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

RUN mkdir /app
COPY --from=clone --chown=nonroot /VERSION /VERSION
COPY --from=builder --chown=nonroot /go/bin/api /app
COPY --from=builder --chown=nonroot /data /data
RUN chmod +x /app/api

LABEL org.opencontainers.image.source="https://github.com/container-images/homebox"

EXPOSE 7745
WORKDIR /app

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD [ "wget", "--no-verbose", "--tries=1", "-O", "-", "http://localhost:7745/api/v1/status" ]

VOLUME [ "/data" ]

USER nonroot
ENTRYPOINT [ "/app/api" ]
CMD [ "/data/config.yml" ]
