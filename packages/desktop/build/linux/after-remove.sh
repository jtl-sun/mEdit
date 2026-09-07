#!/bin/sh
set -e

# Remove only the lowercase alias created by mEdit. Never remove another app's
# executable or symlink if /usr/bin/medit was later reassigned.
if [ -L /usr/bin/medit ] && [ "$(readlink /usr/bin/medit 2>/dev/null || true)" = "/usr/bin/mEdit" ]; then
  rm -f /usr/bin/medit
fi

exit 0
