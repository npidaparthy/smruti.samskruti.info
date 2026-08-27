#!/bin/bash
# Run before git push — regenerates version.json and stamps the service
# worker's cache version from the latest commit, so the PWA can never end up
# silently stuck on a stale build (the browser only checks for a new SW when
# service-worker.js's own bytes change — see feedback-verify-cwd-before-server
# memory / smriti-v24 incident, 2026-08-27). Mirrors samskruti.info's CI
# "Stamp service worker cache version" step, just run locally via deploy.sh
# instead of a build workflow, since this site deploys straight from `main`.
set -e
COMMIT=$(git log -1 --format="%h")
BUILT=$(git log -1 --format="%aI" | sed 's/[-:T+]//g' | cut -c1-12)
VERSION="${COMMIT}.${BUILT}"
echo "{\"version\":\"${VERSION}\",\"commit\":\"${COMMIT}\",\"built\":\"$(git log -1 --format="%aI")\"}" > version.json
echo "✓ version.json → ${VERSION}"

# Same VERSION string as above (not just the commit hash) — so the cache name
# a browser bumps against and the build badge a user sees in Settings are
# always identical, never two independently-tracked "version" concepts.
sed -i '' "s/const CACHE = 'smriti-[^']*'/const CACHE = 'smriti-${VERSION}'/" service-worker.js
echo "✓ service-worker.js CACHE → smriti-${VERSION}"
