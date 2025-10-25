FROM python:3.14.0@sha256:78ad0471881f0232093c9e6edf58addade7bf106377732e0790c0f0c914b3b7b AS base

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

FROM busybox:1.37.0@sha256:2f590fc602ce325cbff2ccfc39499014d039546dc400ef8bbf5c6ffb860632e7 AS health

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
