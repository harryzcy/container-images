FROM --platform=$BUILDPLATFORM library/alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6 AS clone

# renovate: datasource=github-tags depName=inngest packageName=inngest/inngest versioning=semver digest=commit
ENV VERSION="v1.45.1"
ENV COMMIT="9059f14a79317d977b627730a0f770b710520cc7"

WORKDIR /app

RUN echo "${VERSION}" > /VERSION && \
  apk add --no-cache git && \
  git config --global url."https://github.com/".insteadOf "git@github.com:" && \
  git clone --recursive --depth 1 --branch "${VERSION}" https://github.com/inngest/inngest.git && \
  test "$(git -C inngest rev-parse HEAD)" = "${COMMIT}"

FROM library/node:26.10.0-alpine3.24@sha256:0b36e8c136b94cd4fcf02188228e76c31ad5872eef3fec8cbd2eee500cfd9e80 AS build-frontend

WORKDIR /app

# renovate: datasource=npm depName=pnpm packageName=pnpm
ENV PNPM_VERSION="12.6.0"
# renovate: datasource=npm depName=corepack packageName=corepack
ENV COREPACK_VERSION="0.36.0"

COPY --from=clone /app/inngest ./inngest

RUN apk add --no-cache make && \
  cd inngest && \
  npm install --global "corepack@$COREPACK_VERSION" && \
  corepack prepare "pnpm@$PNPM_VERSION" --activate && \
  make build-ui

FROM --platform=$BUILDPLATFORM library/golang:1.26.7-alpine3.24@sha256:28d89ee9cc0ff9fec75c82ca201e6bf7fdf9a679d4b7b24dfa04f2bb766bb468 AS build-backend

ARG TARGETARCH
ARG TARGETOS

WORKDIR /app

ENV GOFLAGS="-mod=vendor"

COPY --from=build-frontend /app/inngest ./inngest

RUN cd inngest \
  && go generate ./... \
  && CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /go/bin/inngest ./cmd

FROM library/alpine:3.24.2@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6 AS inngest

RUN apk add --no-cache ca-certificates tzdata && update-ca-certificates && \
  addgroup -g 65532 nonroot && adduser -u 65532 -G nonroot -S nonroot

COPY --from=build-backend --chown=nonroot /go/bin/inngest /bin/inngest
COPY --from=clone --chown=nonroot /VERSION /VERSION

USER nonroot

# APIs and Dashboard: 8288
# Connect WebSocket gateway: 8289
EXPOSE 8288 8289
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget alpha doctor healthcheck

CMD ["inngest", "start"]
