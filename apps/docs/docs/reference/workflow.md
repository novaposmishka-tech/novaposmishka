---
sidebar_position: 3
---

# Git Hooks and Conventions

This repository uses Lefthook, commitlint, Commitizen, and [Conventional Commits](https://www.conventionalcommits.org/) to keep branch names and commit history predictable.

## Git Hooks

Lefthook (`lefthook.yml`) enforces:

- **pre-commit**: branch name validation and lint-staged checks for ESLint and Prettier
- **commit-msg**: conventional commit format via commitlint

Branch naming:

```text
<type>/STAR-<number>-<description>
```

Example:

```text
feat/STAR-1582-repo-config
```

Exempt branches: `main`, `master`, `develop`, `dev`, `release/*`, `hotfix/*`.

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

```text
feat(ui): add dark mode toggle
```

For the interactive Commitizen prompt, run:

```bash
pnpm commit
```

## Release Notes

Release automation is driven by [semantic-release](https://semantic-release.gitbook.io/) and the shared [`@repo/semantic-release-config`](./packages/semantic-release-config.md) package.
