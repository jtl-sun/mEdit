#!/bin/sh
set -e

# Remove only aliases created by mEdit. Never remove an unrelated command that
# may have taken either name after installation.
if [ -L /usr/bin/medit ]; then
  TARGET="$(readlink /usr/bin/medit 2>/dev/null || true)"
  if [ "$TARGET" = "/usr/bin/mEdit" ] || [ "$TARGET" = "/usr/bin/marktext" ]; then
    rm -f /usr/bin/medit
  fi
fi

if [ -L /usr/bin/mEdit ] && [ "$(readlink /usr/bin/mEdit 2>/dev/null || true)" = "/usr/bin/marktext" ]; then
  rm -f /usr/bin/mEdit
fi

exit 0
