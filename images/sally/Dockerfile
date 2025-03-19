FROM golang:1.24.1@sha256:af0bb3052d6700e1bc70a37bca483dc8d76994fd16ae441ad72390eea6016d03 AS builder

RUN CGO_ENABLED=0 go install -ldflags="-w -s" go.uber.org/sally@v1.6.0

FROM busybox:1.37.0@sha256:d0db57cdff17ef505a388051e66b973b97360579efb2f32b4f6750b7d89d9ac8 AS health

FROM gcr.io/distroless/base:nonroot@sha256:23fa4a8575bc94e586b94fb9b1dbce8a6d219ed97f805369079eebab54c2cb23

USER nonroot:nonroot
COPY --from=builder --chown=nonroot:nonroot /go/bin/sally /bin/
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=30s --start-period=5s --retries=3 \
  CMD [ "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/", "||", "exit", "1" ]

CMD ["/bin/sally"]
