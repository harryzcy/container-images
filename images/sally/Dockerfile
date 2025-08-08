FROM golang:1.24.6-alpine3.22 AS builder

RUN CGO_ENABLED=0 go install -ldflags="-w -s" go.uber.org/sally@v1.6.0
RUN echo "v1.6.0" > /VERSION

FROM busybox:1.37.0@sha256:f9a104fddb33220ec80fc45a4e606c74aadf1ef7a3832eb0b05be9e90cd61f5f AS health

FROM gcr.io/distroless/base:nonroot@sha256:dca858878977f01b80685240ca2cd9c1bb38958e2ab6f4ed5698c0ea23307143

COPY --from=builder --chown=nonroot:nonroot /go/bin/sally /bin/
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=5s --retries=3 \
  CMD [ "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/", "||", "exit", "1" ]

CMD ["/bin/sally"]
