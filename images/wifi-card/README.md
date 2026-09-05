# WiFi Card

Container image for [wifi-card](https://github.com/bndw/wifi-card)

## Usage

```shell
docker run -d -p 8080:8080 ghcr.io/harryzcy/wifi-card
```

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/wifi-card:latest \
  --repo harryzcy/container-images
```
