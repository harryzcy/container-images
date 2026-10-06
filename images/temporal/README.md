# temporal

Container image for [temporal](https://github.com/temporalio/temporal), built from source.

## Usage

The server needs an external database and a [dynamic config](https://docs.temporal.io/references/dynamic-configuration) file. The file may be empty. Assuming a Postgres container named `postgres` on the `temporal` network:

```shell
mkdir -p dynamicconfig && touch dynamicconfig/docker.yaml
docker run --network temporal -p 7233:7233 \
  -e DB=postgres12 -e POSTGRES_SEEDS=postgres -e POSTGRES_USER=temporal -e POSTGRES_PWD=temporal \
  -v ./dynamicconfig:/etc/temporal/config/dynamicconfig:ro \
  ghcr.io/harryzcy/temporal
```

The container runs `temporal-server start` by default. Configuration comes from the server's embedded config template, which reads environment variables. `temporal-sql-tool` is also included for setting up and upgrading the database schema.

This image is a drop-in replacement for `temporalio/server`, so upstream's [compose examples](https://github.com/temporalio/samples-server/tree/main/compose) work with only the image name changed. It runs as `nonroot` (UID 65532) rather than upstream's UID 1000. SQLite (`DB=sqlite`) needs a writable working directory, since the database files are created there and the default `/etc/temporal` is read-only for `nonroot`.

## Schema setup

Run once before first start, and again after upgrading:

```shell
docker run --rm --network temporal -e SQL_PLUGIN=postgres12 -e SQL_HOST=postgres -e SQL_PORT=5432 -e SQL_USER=temporal -e SQL_PASSWORD=temporal ghcr.io/harryzcy/temporal \
  sh -c 'temporal-sql-tool --db temporal create-database && \
    temporal-sql-tool --db temporal setup-schema -v 0.0 && \
    temporal-sql-tool --db temporal update-schema -d /etc/temporal/schema/postgresql/v12/temporal/versioned && \
    temporal-sql-tool --db temporal_visibility create-database && \
    temporal-sql-tool --db temporal_visibility setup-schema -v 0.0 && \
    temporal-sql-tool --db temporal_visibility update-schema -d /etc/temporal/schema/postgresql/v12/visibility/versioned'
```

## Environment variables

  - `DB`: `postgres12`, `mysql8`, `sqlite` or `cassandra` (default)
  - `POSTGRES_SEEDS`, `POSTGRES_USER`, `POSTGRES_PWD`, `DB_PORT`: database connection
  - `DBNAME`, `VISIBILITY_DBNAME`: database names (default `temporal` and `temporal_visibility`)
  - `DYNAMIC_CONFIG_FILE_PATH`: dynamic config file (default `/etc/temporal/config/dynamicconfig/docker.yaml`, must exist)
  - `BIND_ON_IP`: address to bind on (default: the container's IP)
  - `LOG_LEVEL`: `info` by default

See the [embedded config template](https://github.com/temporalio/temporal/blob/v1.32.0/common/config/config_template_embedded.yaml) for the full list.

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/temporal:latest \
  --repo harryzcy/container-images
```
