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
mkdir -p "$DEST"
rm -f "$DEST"/*

REMOTE_BASE='/home/www/STRATO-apps/wordpress_02/app/wp-content/uploads/2026/07'

copy_media() {
  local source="$1"
  local target="$2"
  scp -q -o BatchMode=yes -o StrictHostKeyChecking=yes \
    "$STRATO_SSH_USER@$STRATO_SSH_HOST:$REMOTE_BASE/$source" \
    "$DEST/$target"
  test -s "$DEST/$target"
}

copy_media 'Luftbild-Annimation-Rosenhagen-Kopie-2.webp' 'rosenhagen-projekt.webp'
copy_media 'Bildschirmfoto-2026-07-20-um-20.53.07.png' 'rosenhagen-kataster.png'
copy_media 'Luftbild-Rosenhagen2.webp' 'rosenhagen-luftbild.webp'
copy_media 'Strandvilla-front.webp' 'strandvilla-visualisierung.webp'
copy_media 'Expose-Terrasse.webp' 'terrasse-visualisierung.webp'
copy_media 'Strand-1.webp' 'rosenhagen-strand-1.webp'
copy_media 'Strand-4.webp' 'rosenhagen-strand-4.webp'

echo "WordPress 02 media fetched: $(find "$DEST" -maxdepth 1 -type f | wc -l) files"
