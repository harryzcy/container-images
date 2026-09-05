# Excalidraw

The container image for [Excalidraw](https://github.com/excalidraw/excalidraw)

```shell
docker run -d -p 8080:8080 ghcr.io/harryzcy/excalidraw
```

## Verification

Images built from `main` carry a signed build provenance attestation:

```shell
gh attestation verify oci://ghcr.io/harryzcy/excalidraw:latest \
  --repo harryzcy/container-images
```
