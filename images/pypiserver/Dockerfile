FROM library/python:3.14.6@sha256:1d104eba09001f83c5fd4540fe15b44c691a76c6c816ade0e699b49518e344d8 AS base

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

FROM library/busybox:1.38.0@sha256:fd8d9aa63ba2f0982b5304e1ee8d3b90a210bc1ffb5314d980eb6962f1a9715d AS health

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
