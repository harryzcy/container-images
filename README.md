# Container Images

## Images

| Image | Docs |
| ----- | ---- |
| excalidraw | [images/excalidraw/README.md](./images/excalidraw/README.md) |
| homebox | [images/homebox/README.md](./images/homebox/README.md) |
| inngest | [images/inngest/README.md](./images/inngest/README.md) |
| pypiserver | [images/pypiserver/README.md](./images/pypiserver/README.md) |
| resvg | [images/resvg/README.md](./images/resvg/README.md) |
| sally | [images/sally/README.md](./images/sally/README.md) |
| typst | [images/typst/README.md](./images/typst/README.md) |
| wifi-card | [images/wifi-card/README.md](./images/wifi-card/README.md) |
| yt-dlp | [images/yt-dlp/README.md](./images/yt-dlp/README.md) |

## Verification

Images published from `main` are signed with [GitHub Artifact Attestations][gaa],
which bind each image digest to the workflow run and commit that produced it.

```shell
gh attestation verify oci://ghcr.io/harryzcy/typst:latest \
  --repo harryzcy/container-images
```

`--repo` matches only the repository. To also pin the exact workflow that signed
the image, so an attestation minted by any other workflow or ref is rejected:

```shell
gh attestation verify oci://ghcr.io/harryzcy/typst:latest \
  --repo harryzcy/container-images \
  --cert-identity https://github.com/harryzcy/container-images/.github/workflows/release.yml@refs/heads/main
```

[gaa]: https://docs.github.com/en/actions/concepts/security/artifact-attestations
