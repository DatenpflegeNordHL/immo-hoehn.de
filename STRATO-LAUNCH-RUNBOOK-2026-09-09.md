# Höhn Immobilien – STRATO Launch Runbook

Stand: 2026-09-09  
Status: **VORBEREITET – KEIN PRODUKTIONSDEPLOYMENT AUSGEFÜHRT**

Dieses Runbook beschreibt den sicheren Relaunch von `immo-hoehn.de` auf dem vorhandenen STRATO-Hosting. Es ist keine Freigabe, den Livebestand ohne finalen Recheck zu überschreiben.

## 1. Vorbedingungen

Vor dem Produktionswechsel müssen erledigt beziehungsweise bestätigt sein:

- finale §34c-/Impressumsdaten aus den tatsächlichen Höhn-Unterlagen;
- finale Datenschutzerklärung passend zum echten Produktionsstack;
- alle vier aktuellen Objektangebote unmittelbar neu geprüft;
- Entscheidung zum Mietbereich zum Launch;
- vollständige Legacy-URL-Inventur soweit aus Search Console, Serverdaten und Backlinks verfügbar;
- Backup der aktuellen Produktionsdateien und der vorhandenen `.htaccess`;
- funktionierender Zugriff auf das richtige Domain-/Webspace-Ziel.

## 2. Aktueller STRATO-PHP-Rahmen

STRATO dokumentiert für aktuelle Hosting-Pakete PHP 8.x und ermöglicht aktuell die Auswahl zwischen PHP 8.2, 8.3, 8.4 und 8.5. STRATO empfiehlt derzeit mindestens PHP 8.4.

Offizielle Quellen:

- https://www.strato.de/faq/hosting/wie-aendere-ich-meine-php-einstellungen-im-hosting-paket/
- https://www.strato.de/faq/hosting/mit-welchen-modulen-steht-php-bei-strato-zur-verfuegung/

Für den Höhn-Relaunch soll vor dem Upload die tatsächlich für die Domain eingestellte PHP-Version geprüft werden. Ziel: unterstützte aktuelle 8.x-Version, bevorzugt 8.4 oder neuer, sofern der reale Hostingvertrag dies bereitstellt.

## 3. Produktionsbuild

Der normale Arbeitsbranch-Build ist absichtlich `noindex,nofollow`.

Der Produktionsbuild wird lokal beziehungsweise in einer kontrollierten Build-Umgebung explizit erzeugt mit:

```bash
npm ci --no-audit --no-fund
PUBLIC_SITE_NOINDEX=false npm run build
```

Anschließend prüfen:

- `dist/index.html` enthält `index,follow`;
- Impressum und Datenschutz haben den vorgesehenen finalen Robots-Status;
- Canonicals zeigen ausschließlich auf `https://immo-hoehn.de/...`;
- Sitemap enthält nur freigegebene indexierbare Seiten;
- `public/api/contact.php` wurde als `/api/contact.php` in den Build übernommen;
- keine Staging-/localhost-/Preview-URL im Output.

## 4. Bestehende Produktion sichern

Vor jeder Änderung:

1. aktuelle Webroot-Zuordnung der Domain verifizieren;
2. vollständige aktuelle Website-Dateien sichern;
3. bestehende `.htaccess` separat sichern;
4. vorhandene WordPress-/Security-/PHP-Regeln dokumentieren;
5. vorhandene alte Exposés/PDFs/Medien nicht ungeprüft löschen;
6. Zeitpunkt und Backup-Pfad dokumentieren.

Die vorbereitete Datei `deploy/strato-redirects.htaccess` ist **keine vollständige Ersatz-.htaccess**. Ihre Regeln müssen mit den real vorhandenen Produktionsregeln zusammengeführt werden.

## 5. Objekt-Recheck unmittelbar vor Umschaltung

Aktuell vorgesehene neue Objektseiten:

- `/immobilien/einfamilienhaus-poetenitz-1724/`
- `/immobilien/eigentumswohnung-poetenitz-1722/`
- `/immobilien/baugrundstuecke-rosenhagen/`
- `/immobilien/baugrundstuecke-rosenhagen-von-privat/`

Für jedes Objekt erneut prüfen:

- noch verfügbar / reserviert / verkauft;
- aktueller Kaufpreis beziehungsweise Quadratmeterpreis;
- Flächen;
- Courtage;
- Energieangaben, sofern vorhanden;
- Nutzungshinweise;
- Kontakt-/Anfrageweg.

Erst danach die zugehörigen Objekt-301-Regeln in der Produktions-.htaccess aktivieren.

## 6. Redirects

Bereits sichere Inhaltsredirects sind in `deploy/strato-redirects.htaccess` vorbereitet.

Objekt- und Mietredirects bleiben bis zum Launch-Recheck deaktiviert.

Nach dem Zusammenführen auf dem echten Server jede Regel testen, zum Beispiel:

```bash
curl -I https://immo-hoehn.de/verkaufen
curl -I https://immo-hoehn.de/aktuelle-angebote
curl -I https://immo-hoehn.de/datenschutzerklaerung
```

Erwartung:

- erster Response: `301`;
- genau ein Redirect-Hop;
- finales Ziel: `200`;
- finales Ziel auf `https://immo-hoehn.de`;
- keine Schleife;
- kein Staginghost.

Objekt-Redirects erst nach dem Objekt-Recheck gleichartig testen.

## 7. Kontaktformular / Mailzustellung

Der PHP-Endpunkt ist im Repository bereits syntaktisch und per CI-Smoke-Test geprüft. Offen ist nur die reale Zustellung auf dem STRATO-Webspace.

STRATO dokumentiert für Mailversand aus PHP-/CGI-Skripten, dass kein externer Mailserver verwendet werden soll. Falls ein Skript explizit einen SMTP-Server benötigt, ist `smtp.strato.de` mit Authentifizierung zu verwenden.

Offizielle Quelle:

- https://www.strato.de/faq/mail/e-mail-versand-aus-cgi-und-php-skripten/

Der aktuelle Höhn-Endpunkt nutzt PHP `mail()` und enthält **keine SMTP-Zugangsdaten**.

### Echter Launch-Test

Nach Upload, aber vor finaler Freigabe:

1. Testanfrage über `/kontakt/` mit einer kontrollierten Absenderadresse senden;
2. prüfen, ob die Seite den Erfolgsstatus zeigt;
3. Eingang in `info@immo-hoehn.de` prüfen;
4. Betreff, Umlaute und Nachrichtentext prüfen;
5. `Reply-To` prüfen;
6. Spamordner prüfen;
7. zweite Testanfrage mit ungültigen Pflichtdaten ablehnen lassen;
8. keine echten Zugangsdaten in Repository, JavaScript oder HTML hinterlegen.

Falls `mail()` auf dem realen Paket nicht zuverlässig zustellt, wird **nicht** improvisiert. Dann zuerst STRATO-Paket-/Mailkonfiguration prüfen und gegebenenfalls kontrolliert auf authentifizierten Versand über `smtp.strato.de` umstellen. Zugangsdaten bleiben ausschließlich serverseitig.

## 8. Datenschutz vor Umschaltung

Final dokumentieren:

- STRATO als Hostinganbieter;
- Serverlogs;
- Kontaktformular und PHP-Mailversand;
- tatsächliche Schriftbereitstellung;
- Analytics nur falls wirklich aktiviert;
- Maps/Embeds nur falls wirklich aktiviert;
- Cookies/Consent nur für tatsächlich eingesetzte Technik;
- interne Bearbeitung und Speicherdauer von Kontaktanfragen.

Die derzeit noch extern eingebundenen Google Fonts sind vor der finalen Datenschutzfreigabe entweder korrekt abzubilden oder in einem separaten Self-Hosting-Pass zu eliminieren.

## 9. Smoke-Test direkt nach Umschaltung

Mindestens prüfen:

- `/`
- `/immobilie-verkaufen/`
- `/grundstueck-verkaufen/`
- `/immobilienbewertung/`
- `/immobilien/`
- alle vier Objektseiten
- Dassow, Pötenitz, Rosenhagen, Travemünde, Priwall
- `/kontakt/`
- `/impressum/`
- `/datenschutz/`
- `/robots.txt`
- `/sitemap-index.xml`
- 404-Verhalten
- Kontaktformular
- alle aktivierten 301-Regeln
- mobile Navigation / CTAs
- Open-Graph-Metadaten

## 10. Indexierung erst nach erfolgreichem Smoke-Test

Vor Search-Console-Einreichung verifizieren:

- keine globale `noindex`-Direktive mehr;
- Canonicals korrekt;
- Sitemap erreichbar;
- wichtige Seiten 200;
- Redirects stabil;
- Rechtsseiten final;
- Objekte aktuell;
- Kontaktformular erreichbar.

Erst danach Sitemap in Search Console einreichen beziehungsweise neu anstoßen.

## 11. Rollback

Falls der Relaunch nach Umschaltung einen P0-Fehler zeigt:

1. keine hektischen Einzelpatches auf Produktion verteilen;
2. vorheriges Webroot-/Dateibackup wiederherstellen;
3. vorherige `.htaccess` wiederherstellen;
4. Fehler im Arbeitsbranch reproduzieren und beheben;
5. Build + QA erneut ausführen;
6. erst danach erneut deployen.

## Gate

**Produktionsbuild-Prozess: vorbereitet**  
**STRATO-PHP-Rahmen: geprüft**  
**Kontaktformular Source/CI: PASS**  
**echte Mailzustellung: OFFEN**  
**Redirect-Regeln: vorbereitet**  
**Objekt-Redirect-Ziele: vollständig definiert**  
**finale Rechtsdaten: teilweise offen**  
**Live-Deployment: NICHT AUSGEFÜHRT**
