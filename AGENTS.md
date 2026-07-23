# AI working agreement

This repository uses two continuity documents:

- `docs/PROJECT_SSOT.md` is the authoritative description of the current system.
- `docs/HANDOFF.md` is the operational handoff for the latest work session.

Every AI or human contributor must:

1. Read both documents and inspect `git status` before changing files.
2. Treat `public/` as the only deployable web root.
3. Preserve the compatibility routes `public/Stamp.html` and
   `public/GenerateQR.html` unless a migration has been approved.
4. Run `npm run check` (or `node scripts/validate-static-site.mjs`) after changes.
5. Update `docs/PROJECT_SSOT.md` when architecture, behavior, data contracts,
   dependencies, commands, routes, or known risks change.
6. Always update `docs/HANDOFF.md` before handing work to another contributor.
7. Never place private credentials, service-account keys, or production data in
   the repository. The Firebase web config is a public client identifier; access
   control must be enforced by Firebase Authentication and Database Rules.
8. After every completed repository task, commit the in-scope changes and push
   the current branch to `origin`. This is a standing owner instruction recorded
   on 2026-07-23. A push to `main` triggers GitHub Pages and is authorized for
   routine repository changes.
9. Still require explicit per-action owner approval before changing Firebase
   production rules, erasing production data, rotating credentials, rewriting
   Git history, or force-pushing.

Prefer small, reviewable changes. Record unresolved assumptions and validation
results in the handoff instead of silently guessing.
