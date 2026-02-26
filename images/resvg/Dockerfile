FROM debian:13.3@sha256:3615a749858a1cba49b408fb49c37093db813321355a9ab7c1f9f4836341e9db AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
  curl tar ca-certificates

# renovate: datasource=github-tags depName=resvg packageName=linebender/resvg versioning=semver
ENV VERSION="v0.47.0"

RUN echo "$VERSION" > /VERSION

RUN curl -L "https://github.com/linebender/resvg/releases/download/$VERSION/resvg-linux-x86_64.tar.gz" -o /tmp/resvg.tar.gz \
  && tar -xzf /tmp/resvg.tar.gz -C /bin/ \
  && rm /tmp/resvg.tar.gz

FROM gcr.io/distroless/cc-debian13:nonroot@sha256:26474572388bb8bcbf837002e07b3c068e31b053f0ed1865218fc1e25a7650f6

#checkov:skip=CKV_DOCKER_2: no HEALTHCHECK

WORKDIR /workspace

USER nonroot:nonroot

COPY --from=builder --chown=nonroot:nonroot /bin/resvg /bin/
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION

CMD ["/bin/resvg"]
