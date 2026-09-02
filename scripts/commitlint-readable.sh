#!/usr/bin/env sh
set -u

message_file="${1:-}"

if [ -z "$message_file" ]; then
  echo "Missing commit message file path."
  exit 1
fi

export NVM_DIR="$HOME/.nvm"
# Only source/use nvm when the real (unix) nvm.sh is present. A bare
# `command -v nvm` check is not enough here: on Windows, `nvm` on PATH is
# usually nvm-windows (a different tool, incompatible CLI), and blindly
# running its `nvm use --silent` misparses `--silent` as a version to
# resolve, hitting the network and hanging the commit.
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
  [ -f .nvmrc ] && command -v nvm >/dev/null 2>&1 && nvm use --silent
fi

if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1
fi

output="$(mktemp)"
status=0

pnpm --silent exec commitlint --edit "$message_file" >"$output" 2>&1 || status=$?

if [ "$status" -ne 0 ]; then
  input="$(sed -n 's/^.*input: //p' "$output" | head -n 1)"
  error="$(sed -n 's/^.*   //p' "$output" | grep '\[[^]]*\]' | head -n 1)"

  if [ -n "$input" ] && [ -n "$error" ]; then
    printf 'Invalid commit message: %s - %s\n\n' "$input" "$error"
  fi
fi

sed -E 's/^[^[:alnum:][:space:]]+[[:space:]]*/- /' "$output"
rm -f "$output"

exit "$status"
