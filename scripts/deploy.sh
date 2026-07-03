#!/bin/bash
# Run before git push — regenerates version.json from latest commit
set -e
COMMIT=$(git log -1 --format="%h")
BUILT=$(git log -1 --format="%aI" | sed 's/[-:T+]//g' | cut -c1-12)
VERSION="${COMMIT}.${BUILT}"
echo "{\"version\":\"${VERSION}\",\"commit\":\"${COMMIT}\",\"built\":\"$(git log -1 --format="%aI")\"}" > version.json
echo "✓ version.json → ${VERSION}"
