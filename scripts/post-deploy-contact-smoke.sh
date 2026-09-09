#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${HOEHN_BASE_URL:-https://immo-hoehn.de}"
ENDPOINT="${BASE_URL%/}/api/contact.php"
TMP_HEADERS="$(mktemp)"
trap 'rm -f "$TMP_HEADERS"' EXIT

TEST_MESSAGE='Hallo Tine,

dies ist eine automatisch bzw. maschinell erstellte Testnachricht, die über das Kontaktformular der neuen Höhn-Immobilien-Website versendet wurde.

Mit dieser Nachricht wird geprüft, ob Anfragen, die Kundinnen und Kunden über die Internetseite senden, zuverlässig bei info@immo-hoehn.de ankommen.

Wenn du diese Nachricht erhalten hast, funktioniert die Zustellung des Website-Kontaktformulars wie vorgesehen.

Viele Grüße
Website-Test Höhn Immobilien'

http_code="$({ curl \
  --silent \
  --show-error \
  --max-time 30 \
  --request POST \
  --data-urlencode 'name=Website-Systemtest für Tine' \
  --data-urlencode 'email=info@immo-hoehn.de' \
  --data-urlencode 'telefon=' \
  --data-urlencode 'anliegen=allgemeine-anfrage' \
  --data-urlencode 'objektart=' \
  --data-urlencode 'ort=Dassow OT Pötenitz' \
  --data-urlencode "nachricht=${TEST_MESSAGE}" \
  --data-urlencode 'datenschutz=1' \
  --data-urlencode 'website=' \
  --dump-header "$TMP_HEADERS" \
  --output /dev/null \
  --write-out '%{http_code}' \
  "$ENDPOINT"; } 2>&1)" || {
    echo "Kontakt-Smoke-Test konnte den Endpoint nicht erreichen." >&2
    exit 1
  }

location="$(awk 'BEGIN{IGNORECASE=1} /^location:/ {sub(/^[^:]+:[[:space:]]*/, ""); sub(/\r$/, ""); print; exit}' "$TMP_HEADERS")"

echo "Endpoint: $ENDPOINT"
echo "HTTP: $http_code"
echo "Location: ${location:-<keine>}"

if [[ "$http_code" != "303" ]]; then
  echo "FAIL: Erwartet wurde HTTP 303 vom Kontaktformular." >&2
  exit 1
fi

if [[ "$location" != *"kontakt=erfolg"* ]]; then
  echo "FAIL: Formular meldet keinen erfolgreichen Versand." >&2
  exit 1
fi

echo "PASS: Produktiver Website-Endpunkt hat die Testanfrage angenommen und mail() als erfolgreich gemeldet."
echo "WICHTIG: Die tatsächliche Ankunft im Postfach info@immo-hoehn.de muss anschließend bei Tine sichtbar sein."
