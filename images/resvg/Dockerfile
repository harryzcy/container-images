FROM debian:13.0@sha256:6d87375016340817ac2391e670971725a9981cfc24e221c47734681ed0f6c0f5 AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl tar ca-certificates

ENV VERSION="0.45.0"

RUN echo "$VERSION" > /VERSION

RUN curl -L "https://github.com/linebender/resvg/releases/download/$VERSION/resvg-linux-x86_64.tar.gz" -o /tmp/resvg.tar.gz \
  && tar -xzf /tmp/resvg.tar.gz -C /bin/ \
  && rm /tmp/resvg.tar.gz

FROM gcr.io/distroless/cc-debian12@sha256:d4e8c4c18626ce7c09104d3b39d9e5541ced61de7fb398a455cb09ae5a7b3598

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK
#checkov:skip=CKV_DOCKER_3: use root user for now
#checkov:skip=CKV_DOCKER_7: latest

WORKDIR /workspace

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
