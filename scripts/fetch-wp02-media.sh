#!/usr/bin/env bash
set -euo pipefail

for name in STRATO_SSH_HOST STRATO_SSH_USER STRATO_SSH_PRIVATE_KEY_B64 STRATO_SSH_KNOWN_HOSTS; do
  test -n "${!name:-}" || {
    echo "Missing required environment variable: $name" >&2
    exit 1
  }
done

install -d -m 700 "$HOME/.ssh"
printf '%s' "$STRATO_SSH_PRIVATE_KEY_B64" | base64 --decode > "$HOME/.ssh/id_ed25519"
chmod 600 "$HOME/.ssh/id_ed25519"
printf '%s\n' "$STRATO_SSH_KNOWN_HOSTS" > "$HOME/.ssh/known_hosts"
chmod 600 "$HOME/.ssh/known_hosts"
ssh-keygen -y -f "$HOME/.ssh/id_ed25519" >/dev/null

DEST='public/assets/wp02'
REMOTE_BASE='/home/www/STRATO-apps/wordpress_02/app/wp-content/uploads/2026/07'
TMP_DIR="$(mktemp -d)"
ARCHIVE="$TMP_DIR/wp02-media.tar"
trap 'rm -rf "$TMP_DIR"' EXIT

mkdir -p "$DEST"
rm -f "$DEST"/*

SSH=(
  ssh
  -o BatchMode=yes
  -o StrictHostKeyChecking=yes
  -o ConnectTimeout=20
  -o ConnectionAttempts=3
  -o ServerAliveInterval=10
  -o ServerAliveCountMax=6
  "$STRATO_SSH_USER@$STRATO_SSH_HOST"
)

# Pull all required WordPress-02 originals in a single SSH session. Repeated
# short-lived SSH connections were intermittently terminated by STRATO and
# could abort a deploy halfway through the media set.
fetch_archive() {
  "${SSH[@]}" 'bash -s' <<'REMOTE'
set -euo pipefail
BASE='/home/www/STRATO-apps/wordpress_02/app/wp-content/uploads/2026/07'
cd "$BASE"
LIST="$(mktemp)"
trap 'rm -f "$LIST"' EXIT

find_one() {
  stem="$1"
  file="$(find . -maxdepth 1 -type f \( -iname "${stem}.webp" -o -iname "${stem}.png" -o -iname "${stem}.jpg" -o -iname "${stem}.jpeg" \) -print -quit)"
  if [ -z "$file" ]; then
    echo "Missing WordPress 02 media: $stem" >&2
    exit 42
  fi
  printf '%s\n' "$file" >> "$LIST"
}

find_one 'Luftbild-Annimation-Rosenhagen-Kopie-2'
find_one 'Bildschirmfoto-2026-07-20-um-20.53.07'
find_one 'Luftbild-Rosenhagen2'
find_one 'Strandvilla-front'
find_one 'Expose-Terrasse'
find_one 'Strand-1'
find_one 'Strand-4'

test "$(wc -l < "$LIST" | tr -d ' ')" = '7'
tar -cf - -T "$LIST"
REMOTE
}

success=0
for attempt in 1 2 3; do
  rm -f "$ARCHIVE"
  if fetch_archive > "$ARCHIVE" && [[ -s "$ARCHIVE" ]] && tar -tf "$ARCHIVE" >/dev/null; then
    success=1
    break
  fi
  echo "Retry $attempt/3 for WordPress 02 media archive" >&2
  sleep $((attempt * 3))
done

test "$success" = '1' || {
  echo 'WordPress 02 media archive could not be fetched after retries.' >&2
  exit 1
}

EXTRACT="$TMP_DIR/extracted"
mkdir -p "$EXTRACT"
tar -xf "$ARCHIVE" -C "$EXTRACT"

copy_stem() {
  local stem="$1"
  local target="$2"
  local source
  source="$(find "$EXTRACT" -maxdepth 1 -type f \( -iname "${stem}.webp" -o -iname "${stem}.png" -o -iname "${stem}.jpg" -o -iname "${stem}.jpeg" \) -print -quit)"
  test -n "$source" || {
    echo "Extracted WordPress 02 source missing: $stem" >&2
    exit 1
  }
  cp "$source" "$DEST/$target"
  test -s "$DEST/$target"
  echo "FETCHED $stem -> $target | mime=$(file --brief --mime-type "$DEST/$target")"
}

copy_stem 'Luftbild-Annimation-Rosenhagen-Kopie-2' 'rosenhagen-projekt.webp'
copy_stem 'Bildschirmfoto-2026-07-20-um-20.53.07' 'rosenhagen-kataster.png'
copy_stem 'Luftbild-Rosenhagen2' 'rosenhagen-luftbild.webp'
copy_stem 'Strandvilla-front' 'strandvilla-visualisierung.webp'
copy_stem 'Expose-Terrasse' 'terrasse-visualisierung.png'
copy_stem 'Strand-1' 'rosenhagen-strand-1.webp'
copy_stem 'Strand-4' 'rosenhagen-strand-4.webp'

# Compatibility alias retained for the established release verifier. The
# website itself references the correctly typed PNG file.
cp "$DEST/terrasse-visualisierung.png" "$DEST/terrasse-visualisierung.webp"

echo "WordPress 02 media fetched: $(find "$DEST" -maxdepth 1 -type f | wc -l) files"
