# Sally

Container image for [sally](https://github.com/uber-go/sally)

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/sally:latest \
  --repo harryzcy/container-images
```
