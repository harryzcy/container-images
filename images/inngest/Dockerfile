FROM --platform=$BUILDPLATFORM library/alpine:3.23 AS clone

WORKDIR /app

RUN apk add --no-cache git && \
  git clone --depth 1 --branch v1.30.0 https://github.com/inngest/inngest.git

FROM library/node:26.3.1-alpine3.23@sha256:bead114a5f13c3f193e6278d28bc10a3e0cd464cb1c764c1abac79b1cc15f64f AS build-frontend

WORKDIR /app

COPY --from=clone /app/inngest ./inngest

RUN apk add --no-cache make && \
  npm install --global corepack@latest && \
  corepack enable pnpm && \
  corepack use pnpm@latest-11 && \
  make build-ui

FROM --platform=$BUILDPLATFORM library/golang:1.26.4-alpine3.23 AS build-backend

ARG TARGETARCH
ARG TARGETOS

RUN apk add build-base

WORKDIR /app

COPY --from=build-frontend /app/inngest ./inngest

RUN git clone --depth 1 --branch v1.30.0 https://github.com/inngest/inngest.git \
  && cd inngest \
  && go mod tidy \
  && go generate ./...

RUN --mount=type=cache,target=/root/.cache/go-build \
  GOFLAGS=-mod=vendor GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /go/bin/inngest cmd/main.go

FROM alpine:3.23 AS inngest

RUN apk add --no-cache ca-certificates tzdata && update-ca-certificates
COPY --from=build-backend /go/bin/inngest /bin/inngest

CMD ["inngest"]
