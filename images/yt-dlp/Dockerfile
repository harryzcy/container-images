FROM debian:13.1@sha256:833c135acfe9521d7a0035a296076f98c182c542a2b6b5a0fd7063d355d696be AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl ca-certificates

ENV VERSION="2025.09.05"

RUN echo "$VERSION" > /VERSION

RUN curl -L "https://github.com/yt-dlp/yt-dlp/releases/download/${VERSION}/yt-dlp_linux" -o /bin/yt-dlp

FROM gcr.io/distroless/base-nossl-debian12:nonroot

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/yt-dlp /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/yt-dlp"]
