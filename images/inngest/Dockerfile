FROM --platform=$BUILDPLATFORM library/alpine:3.24.1@sha256:28bd5fe8b56d1bd048e5babf5b10710ebe0bae67db86916198a6eec434943f8b AS clone

# renovate: datasource=git-tags depName=inngest packageName=https://github.com/inngest/inngest
ENV VERSION="v1.30.0"

WORKDIR /app

RUN echo "${VERSION}" > /VERSION && \
  apk add --no-cache git && \
  git config --global url."https://github.com/".insteadOf "git@github.com:" && \
  git clone --recursive --depth 1 --branch "${VERSION}" https://github.com/inngest/inngest.git

FROM library/node:26.3.1-alpine3.24@sha256:bead114a5f13c3f193e6278d28bc10a3e0cd464cb1c764c1abac79b1cc15f64f AS build-frontend

WORKDIR /app

COPY --from=clone /app/inngest ./inngest

RUN apk add --no-cache make && \
  cd inngest && \
  npm install --global corepack@latest && \
  corepack prepare pnpm --activate && \
  make build-ui

FROM --platform=$BUILDPLATFORM library/golang:1.26.4-alpine3.24@sha256:3ad57304ad93bbec8548a0437ad9e06a455660655d9af011d58b993f6f615648 AS build-backend

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
