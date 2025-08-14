FROM debian:12.11@sha256:731dd1380d6a8d170a695dbeb17fe0eade0e1c29f654cf0a3a07f372191c3f4b AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl tar ca-certificates

ENV VERSION="0.45.0"

RUN echo "$VERSION" > /VERSION

RUN curl -L "https://github.com/linebender/resvg/releases/download/$VERSION/resvg-linux-x86_64.tar.gz" -o /tmp/resvg.tar.gz \
  && tar -xzf /tmp/resvg.tar.gz -C /bin/ \
  && rm /tmp/resvg.tar.gz

FROM gcr.io/distroless/cc-debian12@sha256:00cc20b928afcc8296b72525fa68f39ab332f758c4f2a9e8d90845d3e06f1dc4

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK
#checkov:skip=CKV_DOCKER_3: use root user for now
#checkov:skip=CKV_DOCKER_7: latest

WORKDIR /workspace

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
