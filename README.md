# krois.dk publishing

This repository owns the existing GitHub Pages deployment and `krois.dk` custom domain. Website source lives in independent sibling repositories; the iPhone/Watch app is outside this website workspace.

```text
/Users/mathiaskroismoller/Git/
├── Unbound/                 independent app repo (unchanged)
└── krois/                   grouping folder, not a Git repo
    ├── unbound-web/         promotional website
    ├── WordWin/             word-game tool
    ├── dtu-courses/         course companion
    └── krois-site/          this publishing repo
```

## Release contract

`releases.json` records a full verified commit SHA for each project. Every project’s `npm run build` emits only public files into `dist/`. This publisher places Unbound at `/unbound/`, WordWin at `/wordwin/` and DTU at `/dtu/`. `/WordWin/` retains the existing legacy migration route. Each current lowercase mount has a `release.json` showing its source repository and deployed commit.

The root page and domain settings are retained from the original deployment. WordWin’s service worker remains confined to `/wordwin/`. The publishing workflow does not build or deploy the independent Unbound app.

## Publish or roll back one project

1. Work in that project’s repository and push a source commit.
2. Wait for its verification workflow and relevant focused checks. For unbound-web, CI only builds; its browser tests run locally (`npm test`) before pushing.
3. Update only that project’s `commit` field in `releases.json` here.
4. Commit and push this repository. **Deploy GitHub Pages** builds all recorded releases and publishes them together.

Each mount's `release.json` (for example `https://krois.dk/unbound/release.json`) shows the commit that is live. To roll back one project, restore its earlier SHA in the manifest. Other release pins stay fixed. Old `wordwin-release.txt` and the manual `wordwin_ref` override are replaced by this single manifest.

## Local assembled preview

```sh
npm run prepare:sources
npm run build
npm run preview
```

`prepare:sources` creates disposable, gitignored `sources/` checkouts at the recorded commits and builds them. Make actual edits in the sibling development repositories. The assembler refuses to publish output from a checkout whose HEAD differs from its recorded pin. No dependency installation is needed for the publisher itself.

## History and migration

This repo was renamed from `mathiaskrois/unbound-site`, retaining its complete history and GitHub Pages settings. The independently extracted website histories have new commit hashes. The original unpublished icon commit is preserved on `archive/local-website-main`; the old DTU worktree branch is preserved on `archive/dtu-worktree`. These branches are historical backups, not publishing sources.

The source repositories own their published branding and assets. Their builds do not depend on the app checkout, downloaded private course materials or browser-local exercise answers.

On macOS, a case-insensitive filesystem cannot hold separate `WordWin/` and `wordwin/` output folders. `npm run preview` serves the legacy route directly from its pinned source, so it cannot overwrite the main app. The Linux GitHub Pages build stages both directories normally. Use this preview command rather than a generic server for the assembled website.
