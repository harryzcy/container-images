# yt-dlp

Container image for [yt-dlp](https://github.com/yt-dlp/yt-dlp)

## Usage

```shell
docker run -it ghcr.io/harryzcy/yt-dlp
```

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/yt-dlp:latest \
  --repo harryzcy/container-images
```
