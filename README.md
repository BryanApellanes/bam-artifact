# Bam Artifact Uploader

Uploads an artifact with a name suffixed with the git commit.

## Inputs

### `namePrefix`

The first part of the artifact name.  When uploaded the artifact's name is {namePrefix}-{gitCommitSha}

### `path`

The path of the folder to upload