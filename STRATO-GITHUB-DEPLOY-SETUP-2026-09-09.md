# Höhn Immobilien – GitHub → STRATO Deploy Setup

Stand: 2026-09-09

## Ziel

Die neue Astro-Seite wird aus GitHub in einen **separaten, leeren STRATO-Ordner** hochgeladen. Die bisherige WordPress-Produktion bleibt bis zur finalen Domain-Umschaltung unangetastet.

Danach können normale Website-Updates vollständig über GitHub Actions in denselben STRATO-Zielordner deployed werden.

## Einmalige Voraussetzungen

Für `.github/workflows/strato-stage-deploy.yml` werden folgende GitHub Repository Secrets benötigt:

- `STRATO_SSH_HOST`
- `STRATO_SSH_USER`
- `STRATO_SSH_PRIVATE_KEY`
- `STRATO_SSH_KNOWN_HOSTS`
- `STRATO_DEPLOY_DIR`

Keine Zugangsdaten gehören in Quellcode, Workflow-Dateien, Issues oder Chatprotokolle.

## Empfohlener Zielordner

Ein neuer, ausschließlich für die Astro-Seite bestimmter Ordner. Der genaue Pfad wird als `STRATO_DEPLOY_DIR` hinterlegt.

Der Workflow verweigert Deployments nach `/`, `wordpress_01`, `wordpress_02` und generell in Pfade mit `wordpress_`.

## SSH-Zugang

STRATO unterstützt SFTP/SSH über Port 22. Ein vorhandener SFTP+SSH-Zugang kann verwendet werden, sofern sein Startverzeichnis den neuen Zielordner erreicht.

Für GitHub Actions wird ein SSH-Key empfohlen. Der Private Key liegt ausschließlich als GitHub Secret `STRATO_SSH_PRIVATE_KEY`; auf STRATO wird nur der Public Key in `~/.ssh/authorized_keys` hinterlegt.

`STRATO_SSH_KNOWN_HOSTS` muss den vorab verifizierten Host-Key des STRATO-Servers enthalten. Der Workflow akzeptiert keinen ungeprüften Host-Key-Wechsel.

## GitHub Secrets eintragen

Repository → Settings → Secrets and variables → Actions → New repository secret.

Die fünf oben genannten Secrets anlegen.

## Stage-Upload

Workflow: **Höhn STRATO Stage Deploy**

Der Workflow ist ausschließlich manuell startbar. Zur Ausführung muss als Bestätigung exakt eingegeben werden:

`DEPLOY-HOEHN-STAGE`

Der Workflow:

1. baut den Production-Intent-Build;
2. prüft Kontakt-PHP und Production Readiness;
3. fügt die saubere neue STRATO-`.htaccess` ein;
4. prüft die Zielpfad-Sicherungen;
5. prüft die SSH-Verbindung;
6. legt den separaten Zielordner an;
7. synchronisiert `dist/` per `rsync --delete` ausschließlich in diesen Zielordner;
8. prüft dort `index.html`, `api/contact.php`, `.htaccess` und `sitemap-index.xml`.

Die Domain wird dabei **nicht** umgeschaltet.

## Einmaliger STRATO-Cutover

Wenn der Stage-Upload vollständig geprüft ist, bleibt noch genau eine Hosting-Umschaltung:

STRATO → Domains → `immo-hoehn.de` → Domain-Zuordnung/Ziel → neuen Astro-Zielordner auswählen.

Die genaue Beschriftung kann je nach STRATO-Paket leicht variieren. Entscheidend ist: `immo-hoehn.de` wird auf den neuen Webspace-Ordner gelegt, nicht extern weitergeleitet.

Vor der Umschaltung den bisherigen Domain-Zielpfad dokumentieren, damit ein Rollback möglich bleibt.

## Sofort nach dem Cutover

- Startseite und Kernrouten 200 prüfen.
- `robots.txt` und `sitemap-index.xml` prüfen.
- Canonicals und `index,follow` prüfen.
- sichere Legacy-301-Redirects prüfen.
- vier Objekt-Altseiten im echten Browser gegen den unmittelbar sichtbaren Objektstatus prüfen; erst dann Objekt-Redirects aktivieren.
- Kontakt-Smoke-Test aus GitHub starten. Die maschinell erzeugte Nachricht geht an Tine und erklärt ausdrücklich, dass damit die Erreichbarkeit von Kundenanfragen über die Internetseite geprüft wird.
- Eingang in `info@immo-hoehn.de` sichtbar bestätigen.

## Danach

Nach erfolgreichem Cutover und Smoke-Test können weitere Website-Updates vollständig über GitHub Actions in denselben STRATO-Zielordner laufen. Ein erneuter STRATO-Portalbesuch ist für normale Content-/Code-Deployments nicht erforderlich.
