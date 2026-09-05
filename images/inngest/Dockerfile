FROM --platform=$BUILDPLATFORM library/alpine:3.24.1@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b AS clone

# renovate: datasource=github-tags depName=inngest packageName=inngest/inngest versioning=semver digest=commit
ENV VERSION="v1.30.0"
ENV COMMIT="6e8e348d0e02fe913727eb52d3355f3648e1913b"

WORKDIR /app

RUN echo "${VERSION}" > /VERSION && \
  apk add --no-cache git && \
  git config --global url."https://github.com/".insteadOf "git@github.com:" && \
  git clone --recursive --depth 1 --branch "${VERSION}" https://github.com/inngest/inngest.git && \
  test "$(git -C inngest rev-parse HEAD)" = "${COMMIT}"

FROM library/node:26.8.1-alpine3.24@sha256:2d984a15c9b54fd0aeb608b8e0d0d83529eb34d2966db27a1fb4f1edc3d298a3 AS build-frontend

WORKDIR /app

# renovate: datasource=npm depName=pnpm packageName=pnpm
ENV PNPM_VERSION="11.25.0"

COPY --from=clone /app/inngest ./inngest

RUN apk add --no-cache make && \
  cd inngest && \
  npm install --global corepack@latest && \
  corepack prepare "pnpm@$PNPM_VERSION" --activate && \
  make build-ui

FROM --platform=$BUILDPLATFORM library/golang:1.26.7-alpine3.24@sha256:28d89ee9cc0ff9fec75c82ca201e6bf7fdf9a679d4b7b24dfa04f2bb766bb468 AS build-backend

ARG TARGETARCH
ARG TARGETOS

WORKDIR /app

COPY --from=build-frontend /app/inngest ./inngest

RUN cd inngest \
  && go mod tidy \
  && go generate ./... \
  && CGO_ENABLED=0 GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /go/bin/inngest ./cmd

FROM library/alpine:3.24.1@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b AS inngest

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
