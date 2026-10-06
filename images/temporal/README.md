# temporal

Container image for [temporal](https://github.com/temporalio/temporal), built from source.

## Usage

```shell
docker run -p 7233:7233 -e DB=postgres12 -e POSTGRES_SEEDS=postgres -e POSTGRES_USER=temporal -e POSTGRES_PWD=temporal ghcr.io/harryzcy/temporal
```

The container runs `temporal-server start` by default. Configuration comes from the server's embedded config template, which reads environment variables. `temporal-sql-tool` is also included for setting up and upgrading the database schema.

## Schema setup

Run once before first start, and again after upgrading:

```shell
docker run --rm -e SQL_PLUGIN=postgres12 -e SQL_HOST=postgres -e SQL_PORT=5432 -e SQL_USER=temporal -e SQL_PASSWORD=temporal ghcr.io/harryzcy/temporal \
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
  - `BIND_ON_IP`: address to bind on (default: the container's IP)
  - `LOG_LEVEL`: `info` by default

See the [embedded config template](https://github.com/temporalio/temporal/blob/main/common/config/config_template_embedded.yaml) for the full list.

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/temporal:latest \
  --repo harryzcy/container-images
```
