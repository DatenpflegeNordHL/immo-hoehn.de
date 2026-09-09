# Höhn Immobilien – Legacy URL / Redirect Matrix

Stand: 2026-09-09  
Branch: `redesign/coastal-blueprint`  
Status: **PARTIAL / EVIDENCE-BASED INVENTORY – vor Produktion vervollständigen**

## Zweck

Diese Matrix schützt bestehende, öffentlich bekannte URLs von `immo-hoehn.de` beim späteren Wechsel auf den neuen Astro-Aufbau. Sie ist ausdrücklich **keine Freigabe für Deployment** und verändert `main` oder die Produktionsseite nicht.

Regel:

- nur eindeutig Höhn Immobilien / Christine Bringmann / Dassow-Pötenitz zuordenbare URLs aufnehmen;
- keine Treffer von `immobilien-hoehn.de` übernehmen – diese Domain gehört zu einem anderen Maklerunternehmen;
- inhaltlich gleichwertige Altseiten per **301** auf die passendste neue URL führen;
- Objekt-URLs nur solange auf ein aktives neues Objekt weiterleiten, wie das Objekt unmittelbar vor Deployment erneut verifiziert wurde;
- bei ausgelaufenen Objekten keine pauschale Weiterleitung auf die Startseite. Dann entweder sinnvoller Objekt-/Kategorie-Ersatz oder sauberer 410/404-Entscheid nach finaler Bestandsprüfung.

## Verifizierte / belastbar bekannte Legacy-URLs

| Legacy URL | Neue Ziel-URL | Aktion | Evidence | Begründung / QA |
|---|---|---:|---|---|
| `/` | `/` | 200 | A | Startseite bleibt Startseite. |
| `/ueber-uns` und `/ueber-uns/` | `/ueber-uns/` | 301/kanonisieren | A | Eindeutige bestehende Unternehmensseite. |
| `/kontakt` und `/kontakt/` | `/kontakt/` | 301/kanonisieren | A | Eindeutige bestehende Kontaktseite. Öffentliche E-Mail im Neubau ausschließlich `info@immo-hoehn.de`. |
| `/impressum` und `/impressum/` | `/impressum/` | 301/kanonisieren | A | Eindeutige bestehende Rechtsseite. |
| `/datenschutzerklaerung/` | `/datenschutz/` | 301 | A/C | Legacy-Link ist aktuell über die Alt-Startseite öffentlich verknüpft. |
| `/verkaufen` und `/verkaufen/` | `/immobilie-verkaufen/` | 301 | A | Bestehende Seite trägt zwar den Namen „Verkaufen“, ist inhaltlich aber teilweise käuferorientiert. Neue URL bildet den echten Verkäufer-Funnel ab. |
| `/aktuelle-angebote/` | `/immobilien/` | 301 | A/C | Legacy-Navigation verweist auf „Aktuelle Angebote“; neuer Hub ist `/immobilien/`. |
| `/immobilienangebote/kaufen` und `/immobilienangebote/kaufen/` | `/immobilien/` | 301 | A | Bestehender Käufer-/Angebotshub wird im Neubau durch `/immobilien/` ersetzt. |
| `/immobilienangebote/kaufen/haeuser/efh-poetenitz` | `/immobilien/einfamilienhaus-poetenitz-1724/` | 301 **nur nach Re-Check** | A | Aktuell verifiziertes Höhn-Objekt 1724. Vor Deployment Status, Preis und Verfügbarkeit erneut prüfen. |
| `/immobilienangebote/kaufen/wohnungen/eigentumswohung` | `/immobilien/eigentumswohnung-poetenitz-1722/` | 301 **nur nach Re-Check** | A | Aktuell verifiziertes Höhn-Objekt 1722. Legacy-Slug enthält die bestehende Schreibweise `eigentumswohung`; genau diese URL muss abgefangen werden. |
| `/immobilienangebote/kaufen/grundstuecke/rosenhagen` | `/immobilien/baugrundstuecke-rosenhagen/` | 301 **nur nach Re-Check** | A | Öffentlich verifizierter Rosenhagen-Grundstücksbestand. Vor Deployment Verfügbarkeit aller Teilgrundstücke erneut prüfen. |

## Noch zu inventarisieren

Vor Produktionsfreigabe muss zusätzlich eine vollständige Alt-URL-Liste aus mindestens folgenden Quellen zusammengeführt werden:

1. aktuelle Produktionsnavigation und alle darunter erreichbaren Unterseiten;
2. vorhandene Sitemap(s), falls öffentlich oder serverseitig verfügbar;
3. Google Search Console – indexierte / Impressionen erzeugende URLs;
4. GA4 bzw. vorhandene Analytics-Landingpages, falls verfügbar;
5. STRATO-/Webserver-Dateistruktur und vorhandene Redirect-Regeln;
6. Google-/Bing-Indexabfragen und bekannte externe Backlinks;
7. alte Immobilienkategorien, Objektseiten, PDF-/Exposé-URLs und Medien-URLs;
8. mögliche URL-Varianten mit/ohne Slash, `www`, HTTP sowie historische Schreibweisen.

## Nicht automatisch umleiten

Folgende Muster dürfen nicht blind auf `/` umgeleitet werden:

- unbekannte ehemalige Objektseiten;
- alte PDF-Exposés;
- nicht mehr verfügbare Immobilien ohne inhaltlich passenden Nachfolger;
- beliebige 404-URLs;
- fremde Höhn-Domains bzw. Treffer von `immobilien-hoehn.de`.

Massenhafte Homepage-Redirects würden Suchmaschinen und Nutzern den eigentlichen Inhalt verschleiern und sind für eine saubere Migration ungeeignet.

## Deployment-Implementierung

Die konkrete Redirect-Technik wird erst festgelegt, wenn das Zielhosting final ist:

- **Vercel:** Redirects in `vercel.json` oder Framework-Konfiguration;
- **nginx:** explizite `return 301` / `rewrite`-Regeln;
- **Apache/STRATO:** `.htaccess` mit möglichst expliziten Regeln;
- niemals mehrere Redirect-Hops bauen, wenn ein direkter 301 möglich ist.

Nach Implementierung müssen alle Regeln automatisiert geprüft werden auf:

- erwarteten Statuscode;
- genau ein Redirect-Hop;
- korrektes finales Ziel;
- keine Redirect-Loops;
- Canonical des Zieles;
- keine Weiterleitung auf Staging-Hosts.

## Aktueller Gate-Status

**Bekannte P0-Legacy-URLs: gemappt**  
**Vollständige URL-Inventur: noch offen**  
**Redirect-Implementierung: BLOCKED bis Zielhosting / Produktionsfreigabe**  
**`main`: unverändert**
