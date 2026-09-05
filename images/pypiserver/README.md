# pypiserver

Container image for [pypiserver](https://github.com/pypiserver/pypiserver)

## Usage

```shell
docker run -d -p 8080:8080 -v PATH/TO/PACKAGES:/data/packages ghcr.io/harryzcy/pypiserver
```

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/pypiserver:latest \
  --repo harryzcy/container-images
```
