# Immo Höhn Acquisition Scout

Agent-driven Akquise-Radar für Höhn Immobilien.

## Ziel

Der Scout verwaltet einen versionierten Baseline-Stand und verarbeitet nur noch Deltas:

- neue private Verkäufer
- neue direkte Käufergesuche
- neue Investoren-/Ankaufsprofile
- öffentliche Grundstücksverkäufe
- Bauleitplanung / Baurechtsänderungen
- Neubau- und Entwicklungsprojekte
- Preisänderungen, Relistings und deaktivierte Angebote

Die Websuche übernimmt täglich ChatGPT oder Codex. Der Python-Core crawlt **nicht** selbst gegen Portale, sondern validiert, normalisiert, dedupliziert, scored und lernt aus Feedback. Dadurch bleiben Suchmethodik und Plattformzugriff vom deterministischen Datenkern getrennt.

## Architektur

```text
ChatGPT/Codex Web Search
        |
        v
 data/inbox/YYYY-MM-DD.json
        |
        v
 acquisition_scout.cli daily
   |       |        |
   |       |        +--> reports/daily/YYYY-MM-DD.md
   |       +-----------> state/learning.json
   +-------------------> state/baseline.json
```

## Kerngebiete

Dassow, Pötenitz, Rosenhagen, Travemünde, Priwall.

## Signaltypen

`SELLER`, `BUYER`, `INVESTOR`, `PUBLIC_SALE`, `PLANNING`, `NEW_BUILD`, `INVESTOR_SEARCH`, `LEASEHOLD`, `RELISTING`, `MARKET_ONLY`.

## Harte Regeln

- Suchsnippet ist niemals alleinige Verifikation.
- Original-/Primärseite muss geöffnet und aktuell geprüft werden.
- Privat, Makler, Bauträger und Investor werden getrennt klassifiziert.
- `NO_BROKER_CONTACT` und ähnliche Hinweise blockieren Outreach.
- keine CAPTCHA-/Login-Umgehung
- keine automatische Kontaktaufnahme
- keine sensiblen Lebensereignisse als Akquisequelle
- gleiche Immobilie auf mehreren Portalen = ein Lead

## Lokaler Lauf

```bash
cd acquisition-scout
python -m pip install -e .
python -m acquisition_scout.cli daily --inbox data/inbox/2026-09-15.json
```

## Täglicher Agent

Die verbindliche Arbeitsanweisung liegt in `prompts/DAILY_AGENT.md`.

Der Agent liest vor jeder Suche:

1. `config/scope.json`
2. `config/sources.json`
3. `config/policy.json`
4. `state/baseline.json`
5. `state/learning.json`

Danach wird nur der neue Tagesfund nach `data/inbox/` geschrieben. Der Workflow verarbeitet die Datei automatisch.

## Lernen

`state/learning.json` enthält Quellen- und Query-Gewichte. Änderungen sind begrenzt und nachvollziehbar. Compliance-Regeln und Kerngebiete dürfen niemals automatisch gelernt oder überschrieben werden.
