FROM golang:1.24.3@sha256:02a22753ab3426d91ba5ba6f4dfb4ac2454f19b05afdb18d61ab02cbf1a2dffe AS builder

RUN CGO_ENABLED=0 go install -ldflags="-w -s" go.uber.org/sally@v1.6.0
RUN echo "v1.6.0" > /VERSION

FROM busybox:1.37.0@sha256:ce4f0c0a6e67a3a1469e7a8e1fe781f64ba7c652823fdf2d5eac677dd4d095d6 AS health

FROM gcr.io/distroless/base:nonroot@sha256:5c9b112e85b26632c6ba9ac874be9c6b20d61599f6087534ce2b9feeb7f6babf

COPY --from=builder --chown=nonroot:nonroot /go/bin/sally /bin/
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

USER nonroot:nonroot

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=5s --retries=3 \
  CMD [ "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/", "||", "exit", "1" ]

CMD ["/bin/sally"]
