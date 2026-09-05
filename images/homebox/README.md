# homebox

Container image for [homebox](https://github.com/sysadminsmedia/homebox)

## Usage

```shell
chown 65532:65532 -R /PATH/TO/DATA/FOLDER
docker run -d -p 3100:7745 -v /PATH/TO/DATA/FOLDER/:/data ghcr.io/harryzcy/homebox
```

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/homebox:latest \
  --repo harryzcy/container-images
```
