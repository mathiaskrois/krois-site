# Repository map

This is only the krois.dk publisher. Website edits belong in the sibling unbound-web, WordWin and dtu-courses repositories. The independent app at Git/Unbound must not be moved or modified as part of website work.

- Check status and preserve local work.
- releases.json is the single record of deployed source SHAs. Update only the requested project pin.
- scripts/releases.mjs validates repository identities and full SHAs.
- npm run prepare:sources builds disposable pinned checkouts; npm run build stages only public dist outputs.
- Keep existing URLs, domain settings, WordWin legacy migration and service-worker scope.
- Do focused checks appropriate to the change; do not rerun app or broad browser tests for publishing-only changes.
- Push project source first, verify it, then update this repo’s pin and deploy. Never edit the cached sources/ checkouts.
