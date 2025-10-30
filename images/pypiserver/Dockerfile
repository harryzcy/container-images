FROM python:3.12.11-alpine3.22@sha256:efcdfa6a6b2fd2afb9c7dfa9a5b288a6f68338b5cfdebe6b637d986067d85757 AS base

FROM base AS builder

WORKDIR /app

COPY requirements.txt .
COPY requirements-pip.txt .

RUN python -m venv venv && \
  # upgrade pip first, with hash check
  venv/bin/pip install --no-cache-dir -U --require-hashes -r requirements-pip.txt && \
  venv/bin/pip install --no-cache-dir --require-hashes -r requirements.txt && \
  rm requirements.txt && \
  find venv -type d -a -name test -o -name tests -exec rm -rf '{}' \+ && \
  find venv -name "*.pyc" -exec rm -f {} \+ && \
  find venv -name "*.pyo" -exec rm -f {} \+ && \
  find venv -type d -name "__pycache__" -exec rm -r {} \+

RUN echo $(venv/bin/pypi-server --version) > /VERSION

FROM busybox:1.37.0@sha256:e3652a00a2fabd16ce889f0aa32c38eec347b997e73bd09e69c962ec7f8732ee AS health

FROM base

WORKDIR /app

RUN addgroup --system nonroot && adduser --system nonroot -G nonroot

USER nonroot

COPY --from=builder --chown=nonroot:nonroot /app /app
COPY --from=builder --chown=nonroot:nonroot /VERSION /VERSION
COPY --from=health --chown=nonroot:nonroot /bin/wget /bin/

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["venv/bin/pypi-server", "run", "-p", "8080", "/data/packages"]
