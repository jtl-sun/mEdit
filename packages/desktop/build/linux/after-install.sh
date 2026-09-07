#!/bin/sh
set -e

# electron-builder installs /usr/bin/mEdit. Add a lowercase alias as a
# convenience for terminal users without overwriting an unrelated command.
if [ -L /usr/bin/medit ]; then
  if [ "$(readlink /usr/bin/medit 2>/dev/null || true)" = "/usr/bin/mEdit" ]; then
    ln -sfn /usr/bin/mEdit /usr/bin/medit
  fi
elif [ ! -e /usr/bin/medit ]; then
  ln -s /usr/bin/mEdit /usr/bin/medit
fi

exit 0
