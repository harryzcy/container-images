FROM --platform=$BUILDPLATFORM library/golang:1.26.4-alpine3.23 AS build

ARG TARGETARCH
ARG TARGETOS

RUN apk add build-base

WORKDIR /app

RUN git clone --depth 1 --branch v1.30.0 https://github.com/inngest/inngest.git \
  && cd inngest \
  && go mod tidy \
  && go generate ./... \
  && make build-ui

RUN --mount=type=cache,target=/root/.cache/go-build \
  GOFLAGS=-mod=vendor GOOS=$TARGETOS GOARCH=$TARGETARCH go build -o /go/bin/inngest cmd/main.go

FROM alpine:3.23 AS inngest

RUN apk add --no-cache ca-certificates tzdata && update-ca-certificates
COPY --from=build /go/bin/inngest /bin/inngest

CMD ["inngest"]
