# resvg

Container image for [resvg](https://github.com/linebender/resvg)

## Usage

```shell
docker run -it -v $(pwd):/workspace ghcr.io/harryzcy/resvg input.svg output.png
```

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/resvg:latest \
  --repo harryzcy/container-images
```
