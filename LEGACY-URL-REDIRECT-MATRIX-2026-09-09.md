# Höhn Immobilien – Legacy URL / Redirect Matrix

Stand: 2026-09-09  
Branch: `redesign/coastal-blueprint`  
Status: **EXPANDED EVIDENCE-BASED INVENTORY – Search Console / Serverdaten vor Produktion ergänzen**

## Zweck

Diese Matrix schützt bestehende, öffentlich bekannte URLs von `immo-hoehn.de` beim späteren Wechsel auf den neuen Astro-Aufbau. Sie ist ausdrücklich **keine Freigabe für Deployment** und verändert `main` oder die Produktionsseite nicht.

Regeln:

- nur eindeutig Höhn Immobilien / Christine Bringmann / Dassow-Pötenitz zuordenbare URLs aufnehmen;
- keine Treffer anderer ähnlich benannter Höhn-Domains übernehmen;
- inhaltlich gleichwertige Altseiten per **301** auf die passendste neue URL führen;
- Objekt-URLs nur solange auf ein aktives neues Objekt weiterleiten, wie das Objekt unmittelbar vor Deployment erneut verifiziert wurde;
- bei ausgelaufenen Objekten keine pauschale Weiterleitung auf die Startseite;
- Schreibfehler in tatsächlich existierenden Alt-Slugs müssen exakt abgefangen werden;
- Weiterleitungen möglichst in einem Hop ausführen.

## Öffentlich verifizierte Legacy-URLs

| Legacy URL | Neue Ziel-URL / Entscheidung | Aktion | Evidence | Begründung / QA |
|---|---|---:|---|---|
| `/` | `/` | 200 | A | Startseite bleibt Startseite. |
| `/ueber-uns` und `/ueber-uns/` | `/ueber-uns/` | 301/kanonisieren | A | Eindeutige bestehende Unternehmensseite. |
| `/kontakt` und `/kontakt/` | `/kontakt/` | 301/kanonisieren | A | Eindeutige Kontaktseite. Öffentliche E-Mail im Neubau ausschließlich `info@immo-hoehn.de`. |
| `/impressum` und `/impressum/` | `/impressum/` | 301/kanonisieren | A | Eindeutige bestehende Rechtsseite. |
| `/datenschutzerklaerung` und `/datenschutzerklaerung/` | `/datenschutz/` | 301 | A | Legacy-Navigation verlinkt diese URL. |
| `/verkaufen` und `/verkaufen/` | `/immobilie-verkaufen/` | 301 | A | Neue URL bildet den echten Verkäufer-Funnel ab. |
| `/unsere-dienstleistungen` und `/unsere-dienstleistungen/` | `/immobilie-verkaufen/` | 301 | A | Legacy-Seite beschreibt überwiegend Exposé, Vermarktung, Besichtigungen und Vertragsabwicklung. |
| `/aktuelle-angebote` und `/aktuelle-angebote/` | `/immobilien/` | 301 | A | Legacy-Hauptnavigation verweist auf „Aktuelle Angebote“. |
| `/immobilienangebote` und `/immobilienangebote/` | `/immobilien/` | 301 | A | Oberkategorie des alten Objektbereichs. |
| `/immobilienangebote/kaufen` und `/immobilienangebote/kaufen/` | `/immobilien/` | 301 | A | Bestehender Käufer-/Angebotshub wird durch `/immobilien/` ersetzt. |
| `/immobilienangebote/kaufen/grundstuecke` und Slash-Variante | `/immobilien/` | 301 | A | Alte Grundstückskategorie. Neuer Hub bündelt den echten Bestand; Verkäuferintent liegt separat auf `/grundstueck-verkaufen/`. |
| `/immobilienangebote/kaufen/haeuser` und Slash-Variante | `/immobilien/` | 301 | A | Alte Häuserkategorie; aktuell kein eigener statischer Häuser-Hub vorgesehen. |
| `/immobilienangebote/kaufen/wohnungen` und Slash-Variante | `/immobilien/` | 301 | A | Alte Wohnungskategorie; aktuell kein eigener statischer Wohnungs-Hub vorgesehen. |
| `/immobilienangebote/mieten` und Slash-Variante | `/immobilien/` | 301 **vor Launch nochmals prüfen** | A | Alte Miet-Kategorie existiert. Zielhub zeigt aktuellen Bestand; falls zum Launch eine eigene Mietstruktur entsteht, Ziel entsprechend ändern. |
| `/immobilienangebote/kaufen/haeuser/efh-poetenitz` | `/immobilien/einfamilienhaus-poetenitz-1724/` | 301 **nur nach Re-Check** | A | Aktuell verifiziertes Höhn-Objekt 1724. Status, Preis und Verfügbarkeit vor Deployment erneut prüfen. |
| `/immobilienangebote/kaufen/wohnungen/eigentumswohung` | `/immobilien/eigentumswohnung-poetenitz-1722/` | 301 **nur nach Re-Check** | A | Aktuell verifiziertes Höhn-Objekt 1722. Alt-Slug enthält tatsächlich den Schreibfehler `eigentumswohung`. |
| `/immobilienangebote/kaufen/grundstuecke/rosenhagen` | `/immobilien/baugrundstuecke-rosenhagen/` | 301 **nur nach Re-Check** | A | Öffentlich verifizierter Rosenhagen-Grundstücksbestand. |
| `/immobilienangebote/kaufen/grundstuecke/rosenhagen-von-privat` | `/immobilien/baugrundstuecke-rosenhagen-von-privat/` | 301 **nur nach Re-Check** | A | Separate Privat-Offerte wird als eigenständiges neues Objekt migriert; 1.600 m² und 2.005 m², 900 €/m², provisionsfrei laut Bestandsseite. |

## Aktuell öffentlich bestätigte Legacy-Struktur

Die alte Kaufnavigation enthält nach aktuellem Crawl:

```text
/immobilienangebote/
└── kaufen/
    ├── grundstuecke/
    │   ├── rosenhagen
    │   └── rosenhagen-von-privat
    ├── haeuser/
    │   └── efh-poetenitz
    └── wohnungen/
        └── eigentumswohung
└── mieten/
```

Daneben existieren mindestens:

```text
/verkaufen
/unsere-dienstleistungen
/kontakt
/ueber-uns
/impressum
/datenschutzerklaerung
```

## Historische Höhn-Domain `hoehn-immobilien.de`

Der öffentliche Backlink-Pass vom 09.09.2026 zeigt mehrere aktuelle Drittverzeichnisse, die für **Höhn Immobilien, Trakehner Str. 11, 23942 Pötenitz, Telefon 038826 80911** weiterhin die historische Domain `hoehn-immobilien.de` nennen.

Beispiele:

- https://onlinestreet.de/412276-hoehn-immobilien
- https://regionale-immobilienmakler.de/immobilienmakler-luetgenhof-23942.htm
- https://tags.branchen-info.net/tag/bausubstanz/337147/59/

**Eigentums-/Kontrollstatus laut Projektinhaber am 09.09.2026:** Höhn Immobilien besitzt beziehungsweise kontrolliert die historische Domain **nicht mehr**.

Daraus folgt:

1. **Kein Redirect-Projekt** für `hoehn-immobilien.de` einplanen; technisch besteht keine Kontrolle mehr über diesen Host.
2. Die historische Domain darf nicht Bestandteil einer neuen DNS-, SSL-, Canonical- oder Redirect-Konfiguration werden.
3. Relevante Branchenverzeichnisse sollen nach Möglichkeit auf die kanonische Domain `https://immo-hoehn.de/` korrigiert werden.
4. Keine fremden oder ähnlich benannten Höhn-Domains in diese Migration einbeziehen.

Status: **DOMAIN CONTROL RESOLVED – NOT OWNED / NO REDIRECT POSSIBLE / DIRECTORY CLEANUP ONLY**.

## Noch zu inventarisieren

Vor Produktionsfreigabe muss zusätzlich eine vollständige Alt-URL-Liste aus folgenden Quellen zusammengeführt werden:

1. Google Search Console: indexierte URLs, Landingpages und URLs mit Impressionen/Klicks;
2. vorhandene Sitemap(s), falls öffentlich oder serverseitig verfügbar;
3. STRATO-/Webserver-Dateistruktur und vorhandene Rewrite-/Redirect-Regeln;
4. vorhandene Analytics-Landingpages, falls verfügbar;
5. Google-/Bing-Index und externe Backlinks;
6. alte PDF-/Exposé-URLs und Medien-URLs;
7. URL-Varianten mit/ohne Slash, `www`, HTTP/HTTPS sowie historische Schreibweisen;
8. ehemalige, aktuell nicht mehr über Navigation erreichbare Objektseiten.

## Nicht automatisch umleiten

Nicht blind auf `/` oder `/immobilien/` umleiten:

- unbekannte ehemalige Objektseiten;
- alte PDF-Exposés;
- nicht mehr verfügbare Immobilien ohne inhaltlich passenden Nachfolger;
- beliebige 404-URLs;
- fremde Höhn-Domains;
- `hoehn-immobilien.de`, da die Domain nicht mehr kontrolliert wird.

Alle aktuell bekannten aktiven Objektseiten besitzen inzwischen ein vorgesehenes neues Objektziel. Die vier Objekt-Redirects bleiben trotzdem bis zum unmittelbaren Launch-Recheck deaktiviert.

## Deployment-Implementierung

Die konkrete Redirect-Technik hängt vom finalen Hosting ab:

- nginx: explizite `return 301` / `rewrite`-Regeln;
- Apache/STRATO: `.htaccess` mit möglichst expliziten Regeln;
- Vercel nur bei einem tatsächlich eigenständigen Höhn-Projekt: Redirects in Plattform-/Framework-Konfiguration;
- niemals mehrere Redirect-Hops bauen, wenn ein direkter 301 möglich ist.

Nach Implementierung automatisiert prüfen:

- erwarteter Statuscode;
- genau ein Redirect-Hop;
- korrektes finales Ziel;
- keine Redirect-Loops;
- Canonical des Zieles;
- keine Weiterleitung auf Staging-Hosts.

## Aktueller Gate-Status

**Aktuell öffentlich auffindbare Kernstruktur: erweitert gemappt**  
**Rosenhagen-von-Privat-Migration: RESOLVED – eigene neue Objektseite**  
**alle vier aktuell bekannten Objekt-Alt-URLs: Ziel definiert; Aktivierung erst nach Launch-Recheck**  
**historische Domain `hoehn-immobilien.de`: RESOLVED – nicht mehr im Besitz / kein Redirect möglich**  
**Search-Console-/Server-Vollinventur: noch offen**  
**Redirect-Implementierung: vorbereitet, Produktionszusammenführung noch offen**  
**`main`: unverändert**
