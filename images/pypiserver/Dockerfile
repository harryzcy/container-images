FROM python:3.13.3-alpine3.20@sha256:40a4559d3d6b2117b1fbe426f17d55b9100fa40609733a1d0c3f39e2151d4b33 AS base

FROM base AS builder

WORKDIR /app

COPY requirements.txt .

RUN python -m venv venv && \
  venv/bin/pip install --no-cache-dir -U pip && \
  venv/bin/pip install --no-cache-dir -r requirements.txt && \
  rm requirements.txt && \
  find venv -type d -a -name test -o -name tests -exec rm -rf '{}' \+ && \
  find venv -name "*.pyc" -exec rm -f {} \+ && \
  find venv -name "*.pyo" -exec rm -f {} \+ && \
  find venv -type d -name "__pycache__" -exec rm -r {} \+

FROM base

WORKDIR /app

RUN addgroup --system nonroot && adduser --system nonroot -G nonroot

COPY --from=builder --chown=nonroot:nonroot /app /app

RUN echo $(venv/bin/pypi-server --version) > /VERSION

USER nonroot

EXPOSE 8080
HEALTHCHECK  --interval=5m --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
CMD ["venv/bin/pypi-server", "run", "-p", "8080", "/data/packages"]
