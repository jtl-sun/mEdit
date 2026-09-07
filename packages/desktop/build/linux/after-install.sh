#!/bin/sh
set -e

# Keep the legacy Debian package/launcher name for upgrade compatibility, but
# expose stable mEdit commands to users. electron-builder may install either
# /usr/bin/marktext (legacy package name) or /usr/bin/mEdit depending on the
# packaging environment, so detect the executable that actually exists.
if [ -x /usr/bin/marktext ]; then
  TARGET=/usr/bin/marktext
elif [ -x /usr/bin/mEdit ]; then
  TARGET=/usr/bin/mEdit
else
  echo "mEdit: installed executable was not found" >&2
  exit 1
fi

# Do not overwrite an unrelated regular file or symlink. When mEdit itself owns
# the link, refresh it so upgrades repair an old or dangling alias.
if [ "$TARGET" != "/usr/bin/mEdit" ]; then
  if [ -L /usr/bin/mEdit ]; then
    CURRENT="$(readlink /usr/bin/mEdit 2>/dev/null || true)"
    if [ "$CURRENT" = "/usr/bin/marktext" ] || [ "$CURRENT" = "/usr/bin/mEdit" ]; then
      ln -sfn "$TARGET" /usr/bin/mEdit
    fi
  elif [ ! -e /usr/bin/mEdit ]; then
    ln -s "$TARGET" /usr/bin/mEdit
  fi
fi

if [ -L /usr/bin/medit ]; then
  CURRENT="$(readlink /usr/bin/medit 2>/dev/null || true)"
  if [ "$CURRENT" = "/usr/bin/mEdit" ] || [ "$CURRENT" = "/usr/bin/marktext" ]; then
    if [ -x /usr/bin/mEdit ]; then
      ln -sfn /usr/bin/mEdit /usr/bin/medit
    else
      ln -sfn "$TARGET" /usr/bin/medit
    fi
  fi
elif [ ! -e /usr/bin/medit ]; then
  if [ -x /usr/bin/mEdit ]; then
    ln -s /usr/bin/mEdit /usr/bin/medit
  else
    ln -s "$TARGET" /usr/bin/medit
  fi
fi

exit 0
