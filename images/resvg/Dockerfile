FROM debian:13.1@sha256:72547dd722cd005a8c2aa2079af9ca0ee93aad8e589689135feaed60b0a8c08d AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl tar ca-certificates

# renovate: datasource=github-tags depName=resvg packageName=linebender/resvg versioning=semver
ENV VERSION="v0.45.1"

RUN echo "$VERSION" > /VERSION

RUN curl -L "https://github.com/linebender/resvg/releases/download/$VERSION/resvg-linux-x86_64.tar.gz" -o /tmp/resvg.tar.gz \
  && tar -xzf /tmp/resvg.tar.gz -C /bin/ \
  && rm /tmp/resvg.tar.gz

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:4dd5cc58bb27cf9da5960f2a202cecf6c1c05c6ccbf0cda1b8ac24aeb428ca1a

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
