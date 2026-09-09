# Höhn Immobilien – Final Keyword-to-URL Map

Stand: 2026-09-09
Branch: `redesign/coastal-blueprint`
Status: **KANONISCHE URL-/KEYWORD-ENTSCHEIDUNG FÜR CONTENT-BLUEPRINTS**

Diese Datei ersetzt ältere Keyword-/URL-Hypothesen, soweit sie ihr widersprechen.

Grundlage:

- `MASTER-BUILD-PROMPT.md`
- `FRESH-SEO-EVIDENCE-2026-09-09.md`
- `SERP-MAP-2026-09-09.md`
- `FIRST-PARTY-EVIDENCE-UPDATE-2026-09-09.md`
- `TRAVEMUENDE-PRIWALL-BUSINESS-GATE-2026-09-09.md`
- aktuelle Semrush-DE-Daten 2026-09-09
- aktuelle öffentliche SERPs / Portale / First-Party-Seiten

## Statuslogik

- `BUILD P0` = Content Blueprint jetzt erstellen, danach bauen
- `BUILD P1` = nach P0, fachlich freigegeben
- `CONDITIONAL` = SEO sinnvoll, aber Business-/Evidence-Gate noch offen
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
├── grundstueck-verkaufen/          [P1]
├── regionen/
│   ├── dassow/
│   ├── poetenitz/
│   ├── rosenhagen/
│   ├── travemuende/                 [CONDITIONAL]
│   └── priwall/                     [CONDITIONAL]
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

Wismar bleibt vorerst außerhalb Phase A/B-Kernarchitektur und benötigt einen eigenen Konkurrenz-/Business-Fit-Pass.

---

# 2. Finale Keyword-to-URL-Matrix

| URL | Primary Cluster | Secondary Cluster | Intent | Business Value | Evidence | Status | Conversion |
|---|---|---|---|---|---|---|---|
| `/` | Höhn Immobilien / Immobilienmakler Ostseeküste | Immobilien Ostsee, Pötenitz, Dassow, Verkauf, Bewertung | Brand + Commercial | sehr hoch | First-Party Ostseeküste + Leistungen | BUILD P0 | Kontakt / Immobilie anbieten |
| `/immobilie-verkaufen/` | Immobilie verkaufen Ostseeküste | Haus verkaufen, Wohnung verkaufen, Verkaufsablauf, Vermarktung | Transactional Seller | sehr hoch | Leistung First-Party belegt | BUILD P0 | Verkäufer-Lead |
| `/immobilienbewertung/` | Immobilienbewertung Ostseeküste | Haus/Wohnung/Grundstück bewerten, Bewertungsfaktoren | Transactional Seller | sehr hoch | Wertermittlung First-Party belegt | BUILD P0 | Bewertungs-Lead |
| `/immobilien/` | Immobilien Ostsee kaufen | Haus Ostsee kaufen, Wohnung Ostsee kaufen, Ferienimmobilie Ostsee kaufen | Buyer | hoch bei echtem Bestand | Buyer-Nachfrage stark, echtes Inventar vorhanden | BUILD P0 | Objektanfrage |
| `/immobilien/[objekt-slug]/` | objektspezifisch | Region + Immobilientyp + Lage | Transactional Buyer | hoch | nur echte Objekte | BUILD P0 | Objektanfrage |
| `/regionen/dassow/` | Immobilien Dassow | Haus kaufen Dassow, Grundstück, Verkauf/Bewertung | Local Hybrid | hoch | Standort-/Marktbezug belastbar | BUILD P0 | Verkäufer + Käufer |
| `/regionen/poetenitz/` | Immobilien Pötenitz | Haus kaufen Pötenitz, Ostseenähe, Grundstücke | Local Hybrid | hoch | Standort + EFH + ETW First-Party | BUILD P0 | Verkäufer + Käufer |
| `/regionen/rosenhagen/` | Immobilien Rosenhagen | Grundstück Rosenhagen, Küsten-/Bauland | Local / Land | hoch | mehrere konkrete Grundstücksangebote First-Party | BUILD P0 | Grundstücks-/Seller-Lead |
| `/grundstueck-verkaufen/` | Grundstück verkaufen Ostseeküste | Grundstück bewerten, Bauland, Projektbezug | Transactional Seller | hoch | Grundstücks-/Projektbezug belegt | BUILD P1 | Grundstücks-Lead |
| `/regionen/travemuende/` | Immobilienmakler Travemünde / Immobilien Travemünde | Verkauf, Bewertung, Buyer-Inventar | Commercial Local + Hybrid | sehr hoch | Keyword/SERP stark, Höhn-Local-Evidence offen | CONDITIONAL P0 | Makler-/Seller-Lead |
| `/regionen/priwall/` | Immobilien Priwall | Haus/Wohnung kaufen Priwall, Küstenlage | Hybrid Buyer/Local | hoch | Keyword/SERP stark, Höhn-Local-Evidence offen | CONDITIONAL P1 | Käufer + Seller |
| `/ueber-uns/` | Höhn Immobilien / Christine Bringmann | seit 1986, Erfahrung, Leistungen | Trust / Brand | mittel-hoch | First-Party | BUILD P1 | Trust / Kontakt |
| `/kontakt/` | Höhn Immobilien Kontakt | Beratung, Verkauf, Bewertung | Navigational / Lead | sehr hoch | First-Party | BUILD P0 | Lead |
| `/impressum/` | Brand/Legal | NAP | Navigational | Pflicht | First-Party | BUILD P0 | keine SEO-Optimierung |
| `/datenschutz/` | Legal | Formular/Tracking | Navigational | Pflicht | rechtlich zu prüfen | BUILD P0 | keine SEO-Optimierung |

---

# 3. Quantitative Kernsignale

Semrush DE, 2026-09-09:

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

=> SEO-P0, aber Publish-Gate bleibt bis echter Höhn-Service-/Referenzbeleg.

## Priwall

- `immobilien priwall` ~ 70 / KD 11
- `haus kaufen priwall` ~ 260 / KD 17
- `wohnung kaufen priwall` ~ 110 / KD 17

=> eigenständiger Hybrid-Intent bestätigt; Publish-Gate offen.

## Dassow / Pötenitz / Rosenhagen

- `immobilien dassow` ~ 70 / KD 18
- `haus kaufen dassow` ~ 390 / KD 18
- `grundstück kaufen dassow` ~ 20
- `immobilien pötenitz` ~ 20
- `haus kaufen pötenitz` ~ 40
- `immobilien rosenhagen` ~ 20
- `grundstück rosenhagen` ~ 20

Kleine Volumina werden hier durch echte Standort-/Inventar-Evidence gestützt. Deshalb bleiben diese Seiten sinnvoll.

## Ostsee Buyer Cluster

- `ferienwohnung ostsee kaufen` ~ 1.900 / KD 12
- `ferienhaus ostsee kaufen` ~ 1.900 / KD 9
- `haus ostsee kaufen` ~ 1.000 / KD 12
- `wohnung ostsee kaufen` ~ 1.000 / KD 18
- `immobilien ostsee` ~ 590 / KD 24
- `immobilien ostsee kaufen` ~ 590 / KD 11
- `ferienimmobilie ostsee kaufen` ~ 170 / KD 9

=> nicht mit generischen SEO-Seiten angreifen. Primär über echten Bestand, Objektseiten, Regionen und interne Verknüpfung.

---

# 4. Kannibalisierungsregeln

## Travemünde

`/regionen/travemuende/` soll bei Freigabe den Kerncluster `Immobilienmakler Travemünde / Immobilien Travemünde` tragen.

`Immobilie verkaufen Travemünde`, `Haus verkaufen Travemünde` und `Wohnung verkaufen Travemünde` werden zunächst als starke Abschnitte/semantische Subcluster auf der Regionsseite und auf `/immobilie-verkaufen/` abgedeckt.

**Nicht jetzt bauen:**

- `/haus-verkaufen-travemuende/`
- `/wohnung-verkaufen-travemuende/`
- `/immobilie-verkaufen-travemuende/`

Separate URLs erst nach Search-Console-/Ranking-Evidence und klarer Intent-Differenzierung.

## Buyer

Keine statischen Seiten wie `/haus-kaufen-travemuende/` oder `/wohnung-kaufen-travemuende/` ohne ausreichendes eigenes Inventar.

Buyer-Cluster zunächst über:

1. `/immobilien/`
2. echte Objektseiten
3. passende Regionsseiten
4. saubere Filter, deren Indexierung kontrolliert wird

## Dassow / Pötenitz / Rosenhagen

Nicht gegenseitig mit denselben Texten kannibalisieren:

- Dassow = regionaler Markt-/Service-Hub
- Pötenitz = Unternehmensstandort + Wohn-/Objektbezug
- Rosenhagen = Grundstücke/Küstenmikrolage/Projektbezug

---

# 5. Ratgeber / Authority – Phase B

Frische Keyword-Signale:

- `was kostet eine immobilienbewertung` ~ 260 / KD 24
- `wie funktioniert eine immobilienbewertung` ~ 40
- `wie verkaufe ich meine immobilie am besten` ~ 40
- `was ist beim verkauf einer immobilie zu beachten` ~ 20
- `welche kosten fallen beim verkauf einer immobilie an` ~ 20
- `wie lange dauert der verkauf einer immobilie` ~ 20
- `immobilie geerbt verkaufen` ~ 110 / KD 10

Diese Themen zunächst in Money Pages als hilfreiche Antwortmodule integrieren.

Eigene Ratgeber-URL erst wenn:

- Suchintention separat ist,
- genügend Inhalt vorhanden ist,
- interne Funnel-Verknüpfung klar ist,
- Rechts-/Steuerthemen sauber aus aktuellen offiziellen Quellen abgesichert sind.

Keine Blog-Farm.

---

# 6. Expansion – ausdrücklich NICHT freigegeben

Quantitativ attraktiv, aber Business-Evidence noch offen:

- Lübeck: `immobilienmakler lübeck` ~720; `haus verkaufen lübeck` ~210; `immobilienbewertung lübeck` ~140
- Boltenhagen: `immobilien boltenhagen` ~480; `haus kaufen boltenhagen` ~480; `wohnung kaufen boltenhagen` ~480
- Wismar: `immobilien wismar` ~880; `immobilienmakler wismar` ~390
- Grevesmühlen: `immobilien grevesmühlen` ~210
- Klütz: `immobilien klütz` ~50
- Kalkhorst: `immobilien kalkhorst` ~20
- Groß Schwansee: `haus kaufen groß schwansee` ~70

Keine dieser Regionen bekommt jetzt eine veröffentlichte Höhn-Landingpage nur wegen Suchvolumen.

---

# 7. Content-Blueprint-Reihenfolge

Jetzt freigegeben:

1. `/`
2. `/immobilie-verkaufen/`
3. `/immobilienbewertung/`
4. `/immobilien/`
5. `/regionen/dassow/`
6. `/regionen/poetenitz/`
7. `/regionen/rosenhagen/`
8. `/kontakt/`
9. `/ueber-uns/`
10. `/grundstueck-verkaufen/`

Travemünde/Priwall-Blueprints dürfen vorbereitet werden, erhalten aber **keine unbelegten Local Claims und keine finale Publish-Freigabe**, bis das Business-Gate geschlossen ist.

---

# 8. Kanonische Kontaktdaten-Regel

Für alle neuen Seiten und Templates:

- E-Mail ausschließlich `info@immo-hoehn.de`
- keine `@t-online.de`-Adresse übernehmen
- NAP konsistent halten

---

# 9. Nächster Schritt

Ab jetzt keine weitere allgemeine Keyword-Sammlung vor dem Build-Start.

Nächste Arbeit:

1. P0 Content Blueprints für die freigegebenen URLs erstellen.
2. Travemünde/Priwall parallel per First-Party-Bestätigung schließen.
3. Danach Content schreiben.
4. Erst anschließend in die Coastal-Blueprint-Designsprache implementieren.

Damit ist die Keyword-to-URL-Phase für die **freigegebenen Kernseiten** fachlich eingefroren.
