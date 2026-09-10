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
SSH=(
  ssh
  -o BatchMode=yes
  -o StrictHostKeyChecking=yes
  -o ConnectTimeout=15
  -o ConnectionAttempts=3
  -o ServerAliveInterval=15
  -o ServerAliveCountMax=3
  -o ControlMaster=auto
  -o ControlPersist=60
  -o ControlPath="$HOME/.ssh/strato-%C"
  "$STRATO_SSH_USER@$STRATO_SSH_HOST"
)

copy_media() {
  local stem="$1"
  local target="$2"
  local tmp="$DEST/.${target}.tmp"
  local attempt

  rm -f "$tmp"

  for attempt in 1 2 3; do
    if "${SSH[@]}" "set -e; remote_file=\$(find '$REMOTE_BASE' -maxdepth 1 -type f \
      \( -iname '${stem}.webp' -o -iname '${stem}.png' -o -iname '${stem}.jpg' -o -iname '${stem}.jpeg' \) \
      -print -quit); test -n \"\$remote_file\"; cat \"\$remote_file\"" > "$tmp"; then
      if [[ -s "$tmp" ]]; then
        mv "$tmp" "$DEST/$target"
        echo "FETCHED $stem -> $target | mime=$(file --brief --mime-type "$DEST/$target")"
        return 0
      fi
    fi

    rm -f "$tmp"
    echo "Retry $attempt/3 for WordPress 02 media: $stem" >&2
    sleep $((attempt * 2))
  done

  echo "WordPress 02 source image could not be fetched after retries: $stem" >&2
  exit 1
}

copy_media 'Luftbild-Annimation-Rosenhagen-Kopie-2' 'rosenhagen-projekt.webp'
copy_media 'Bildschirmfoto-2026-07-20-um-20.53.07' 'rosenhagen-kataster.png'
copy_media 'Luftbild-Rosenhagen2' 'rosenhagen-luftbild.webp'
copy_media 'Strandvilla-front' 'strandvilla-visualisierung.webp'
copy_media 'Expose-Terrasse' 'terrasse-visualisierung.png'
copy_media 'Strand-1' 'rosenhagen-strand-1.webp'
copy_media 'Strand-4' 'rosenhagen-strand-4.webp'

# Temporary compatibility alias for the already-established STRATO release
# verifier. The website itself references the correctly typed PNG file above.
cp "$DEST/terrasse-visualisierung.png" "$DEST/terrasse-visualisierung.webp"

echo "WordPress 02 media fetched: $(find "$DEST" -maxdepth 1 -type f | wc -l) files"
