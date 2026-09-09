# Höhn Immobilien – Final Keyword-to-URL Map

Stand: 2026-09-09
Branch: `redesign/coastal-blueprint`
Status: **KANONISCHE URL-/KEYWORD-ENTSCHEIDUNG + BUILD-STATUS**

Diese Datei ersetzt ältere Keyword-/URL-Hypothesen, soweit sie ihr widersprechen.

Grundlage:

- `MASTER-BUILD-PROMPT.md`
- `FRESH-SEO-EVIDENCE-2026-09-09.md`
- `SERP-MAP-2026-09-09.md`
- `FIRST-PARTY-EVIDENCE-UPDATE-2026-09-09.md`
- `TRAVEMUENDE-PRIWALL-BUSINESS-GATE-2026-09-09.md`
- Semrush-DE-Daten vom 09.09.2026
- aktuelle öffentliche SERPs / First-Party-Seiten
- Business-Freigabe für Travemünde und Priwall vom 09.09.2026

## Statuslogik

- `BUILT P0` = gebaut und QA-geprüft / P0
- `BUILT P1` = gebaut und QA-geprüft / P1
- `PHASE B` = später nach Daten-/Inventarentwicklung
- `BLOCKED` = derzeit nicht bauen

---

# 1. Kanonische Phase-A-Architektur

```text
/
├── immobilien/
│   └── [objekt-slug]/
├── immobilie-verkaufen/
├── immobilienbewertung/
├── grundstueck-verkaufen/          [BUILT P1]
├── regionen/
│   ├── dassow/
│   ├── poetenitz/
│   ├── rosenhagen/
│   ├── travemuende/                [BUILT P0]
│   └── priwall/                    [BUILT P1]
├── ueber-uns/
├── kontakt/
├── impressum/
└── datenschutz/
```

Phase B / später:

```text
/markt/immobilienpreise-travemuende/
/markt/immobilienpreise-dassow/
/ratgeber/...                        nur funnelrelevante Themen
/regionen/boltenhagen/               nur nach Business-Gate
/regionen/kluetz-kluetzer-winkel/    nur nach Business-Gate
/regionen/kalkhorst-gross-schwansee/ nur nach Business-Gate
/regionen/grevesmuehlen/             nur nach Business-Gate
/regionen/luebeck/                    nur nach Business-Gate
```

---

# 2. Finale Keyword-to-URL-Matrix

| URL | Primary Cluster | Secondary Cluster | Intent | Business Value | Evidence | Status | Conversion |
|---|---|---|---|---|---|---|---|
| `/` | Höhn Immobilien / Immobilienmakler Ostseeküste | Dassow, Pötenitz, Travemünde, Priwall, Verkauf, Bewertung | Brand + Commercial | sehr hoch | First-Party + Business Scope | BUILT P0 | Kontakt / Immobilie anbieten |
| `/immobilie-verkaufen/` | Immobilie verkaufen Ostseeküste | Haus verkaufen, Wohnung verkaufen, Verkaufsablauf | Transactional Seller | sehr hoch | Leistung belegt | BUILT P0 | Verkäufer-Lead |
| `/immobilienbewertung/` | Immobilienbewertung Ostseeküste | Haus/Wohnung/Grundstück bewerten | Transactional Seller | sehr hoch | Wertermittlung belegt | BUILT P0 | Bewertungs-Lead |
| `/immobilien/` | Immobilien Ostsee kaufen | Haus/Wohnung/Ferienimmobilie Ostsee kaufen | Buyer | hoch bei echtem Bestand | Nachfrage + reales Inventar | BUILT P0 | Objektanfrage |
| `/immobilien/[objekt-slug]/` | objektspezifisch | Region + Immobilientyp + Lage | Transactional Buyer | hoch | nur echte Objekte | BUILT P0 | Objektanfrage |
| `/regionen/dassow/` | Immobilien Dassow | Haus kaufen Dassow, Grundstück, Verkauf/Bewertung | Local Hybrid | hoch | Standort-/Marktbezug | BUILT P0 | Verkäufer + Käufer |
| `/regionen/poetenitz/` | Immobilien Pötenitz | Haus kaufen Pötenitz, Ostseenähe | Local Hybrid | hoch | Standort + reale Objekte | BUILT P0 | Verkäufer + Käufer |
| `/regionen/rosenhagen/` | Immobilien Rosenhagen | Grundstück Rosenhagen | Local / Land | hoch | reale Grundstücksangebote | BUILT P0 | Grundstücks-/Seller-Lead |
| `/regionen/travemuende/` | Immobilienmakler Travemünde / Immobilien Travemünde | Immobilie/Haus/Wohnung verkaufen Travemünde, Bewertung | Commercial Local + Hybrid | sehr hoch | Business-Freigabe + Keyword/SERP | **BUILT P0** | Makler-/Seller-Lead |
| `/regionen/priwall/` | Immobilien Priwall | Haus/Wohnung Priwall, Verkauf/Bewertung | Hybrid Buyer/Local | hoch | Business-Freigabe + Keyword/SERP | **BUILT P1** | Käufer + Seller |
| `/grundstueck-verkaufen/` | Grundstück verkaufen Ostseeküste | Grundstück bewerten, Bauland | Transactional Seller | hoch | Grundstücks-/Projektbezug | **BUILT P1** | Grundstücks-Lead |
| `/ueber-uns/` | Höhn Immobilien / Christine Bringmann | seit 1986, Erfahrung | Trust / Brand | mittel-hoch | First-Party | BUILT P1 | Trust / Kontakt |
| `/kontakt/` | Höhn Immobilien Kontakt | Beratung, Verkauf, Bewertung | Navigational / Lead | sehr hoch | First-Party | BUILT P0 | Lead |
| `/impressum/` | Brand/Legal | NAP | Navigational | Pflicht | First-Party, Rechtsdetails noch offen | BUILT P0 / LEGAL GATE | keine SEO-Optimierung |
| `/datenschutz/` | Legal | Formular/Tracking | Navigational | Pflicht | rechtlich zu prüfen | BUILT P0 / LEGAL GATE | keine SEO-Optimierung |

---

# 3. Quantitative Kernsignale

Semrush DE, 09.09.2026:

## Travemünde

- `haus kaufen travemünde` ~ 1.600 / KD 19
- `wohnung kaufen travemünde` ~ 1.300 / KD 22
- `immobilien travemünde` ~ 590 / KD 14
- `immobilienmakler travemünde` ~ 140 / KD 14
- `makler travemünde` ~ 110 / KD 19
- `wohnung verkaufen travemünde` ~ 50
- `haus verkaufen travemünde` ~ 40
- `immobilie verkaufen travemünde` ~ 30
- `immobilienbewertung travemünde` ~ 10

=> **SEO-P0 und Business-Gate geschlossen.**

## Priwall

- `immobilien priwall` ~ 70 / KD 11
- `haus kaufen priwall` ~ 260 / KD 17
- `wohnung kaufen priwall` ~ 110 / KD 17

=> eigenständiger Hybrid-Intent bestätigt und Business-Gate geschlossen.

## Dassow / Pötenitz / Rosenhagen

- `immobilien dassow` ~ 70 / KD 18
- `haus kaufen dassow` ~ 390 / KD 18
- `grundstück kaufen dassow` ~ 20
- `immobilien pötenitz` ~ 20
- `haus kaufen pötenitz` ~ 40
- `immobilien rosenhagen` ~ 20
- `grundstück rosenhagen` ~ 20

---

# 4. Kannibalisierungsregeln

## Travemünde

`/regionen/travemuende/` trägt den Kerncluster `Immobilienmakler Travemünde / Immobilien Travemünde`.

`Immobilie verkaufen Travemünde`, `Haus verkaufen Travemünde` und `Wohnung verkaufen Travemünde` werden zunächst als semantische Subcluster auf der Regionsseite und auf `/immobilie-verkaufen/` abgedeckt.

**Nicht separat bauen:**

- `/haus-verkaufen-travemuende/`
- `/wohnung-verkaufen-travemuende/`
- `/immobilie-verkaufen-travemuende/`

Separate URLs erst nach Search-Console-/Ranking-Evidence und klarer Intent-Differenzierung.

## Priwall

`/regionen/priwall/` trägt `Immobilien Priwall` sowie die lokalen Verkäufer-/Bewertungs-Subcluster. Keine separaten statischen Kaufseiten ohne echten eigenen Bestand.

## Buyer

Keine statischen Seiten wie `/haus-kaufen-travemuende/`, `/wohnung-kaufen-travemuende/`, `/haus-kaufen-priwall/` oder `/wohnung-kaufen-priwall/` ohne ausreichendes eigenes Inventar.

Buyer-Cluster laufen über:

1. `/immobilien/`
2. echte Objektseiten
3. passende Regionsseiten
4. kontrollierte Filter

## Dassow / Pötenitz / Rosenhagen

- Dassow = regionaler Markt-/Service-Hub
- Pötenitz = Unternehmensstandort + Wohn-/Objektbezug
- Rosenhagen = Grundstücke/Küstenmikrolage/Projektbezug

---

# 5. Content- und Claim-Regeln Travemünde / Priwall

Freigegeben:

- lokaler Tätigkeitsbereich
- Verkauf / Bewertung / Vermittlung für Travemünde und Priwall
- `Immobilienmakler für Travemünde`
- regionale interne Verlinkung

Nicht ohne Zusatzbeleg:

- eigenes Büro in Travemünde/Priwall
- konkrete historische Verkäufe oder Referenzen
- langjährige Travemünde-spezifische Erfahrung
- aktueller eigener Bestand, wenn nicht tatsächlich vorhanden
- Marktführer-/Nr.-1-Claims

---

# 6. Ratgeber / Authority – Phase B

Relevante Themen bleiben zunächst Bestandteil der Money Pages:

- Kosten einer Immobilienbewertung
- Ablauf einer Immobilienbewertung
- Immobilie richtig verkaufen
- Kosten beim Verkauf
- Verkaufsdauer
- geerbte Immobilie verkaufen

Keine Blog-Farm.

---

# 7. Expansion – noch nicht freigegeben

- Lübeck
- Boltenhagen
- Wismar
- Grevesmühlen
- Klütz
- Kalkhorst
- Groß Schwansee
- Timmendorfer Strand
- Scharbeutz

Diese Regionen benötigen weiterhin einen eigenen Business-/Evidence-Pass.

---

# 8. Build-Status

Gebaut und QA-geprüft:

1. `/`
2. `/immobilie-verkaufen/`
3. `/immobilienbewertung/`
4. `/immobilien/`
5. `/regionen/dassow/`
6. `/regionen/poetenitz/`
7. `/regionen/rosenhagen/`
8. `/regionen/travemuende/`
9. `/kontakt/`
10. `/regionen/priwall/`
11. `/ueber-uns/`
12. `/grundstueck-verkaufen/`

Aktueller QA-Stand: 18 statische Seiten gebaut, 170/170 Multi-Viewport-Prüfungen bestanden und 16/16 Lighthouse-Hard-Gates bestanden.

---

# 9. Kanonische Kontaktdaten-Regel

Für alle neuen Seiten und Templates:

- E-Mail ausschließlich `info@immo-hoehn.de`
- keine `@t-online.de`-Adresse übernehmen
- NAP konsistent halten

Damit ist die Keyword-to-URL-Phase für die aktuelle Phase-A-Architektur eingefroren. Weitere URLs nur nach Business-/Evidence-Gate oder Search-Console-Evidence.
