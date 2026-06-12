#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "==> GitHub"
if ! gh auth status >/dev/null 2>&1; then
  echo "请先登录 GitHub: gh auth login -h github.com -p https -w"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create mission --public --source=. --remote=origin --push --description "使命必达 — 定时通知服务官网"
else
  git push -u origin main
fi

echo "==> Netlify"
if ! npx netlify status >/dev/null 2>&1; then
  echo "请先登录 Netlify: npx netlify login"
  exit 1
fi

if ! npx netlify status 2>&1 | grep -q "Current project"; then
  REMOTE="$(git remote get-url origin)"
  npx netlify init --git-remote-url "$REMOTE" || npx netlify init
fi

npx netlify deploy --prod

echo "Done."
