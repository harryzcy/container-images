FROM library/python:3.12.12-alpine3.23@sha256:f47255bb0de452ac59afc49eaabe992720fe282126bb6a4f62de9dd3db1742dc AS base

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

FROM library/busybox:1.37.0@sha256:d80cd694d3e9467884fcb94b8ca1e20437d8a501096cdf367a5a1918a34fc2fd AS health

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
