# Höhn Immobilien – Eastern Mecklenburg Keyword Pass

Stand: 2026-09-07
Branch: `redesign/coastal-blueprint`

## Scope

Östlicher Suchraum ab Dassow, grob bis ca. 50 km Richtung Mecklenburg-Vorpommern / Wismar.

Untersuchte Orte und Cluster:
- Dassow
- Schönberg (Mecklenburg)
- Klütz / Klützer Winkel
- Boltenhagen
- Kalkhorst
- Groß Schwansee
- Grevesmühlen
- Hohenkirchen / Wismarer Bucht
- Zierow
- Wismar

## Methodik

- Google-/Ubersuggest-Autocomplete für reale Long-Tail-Signale
- aktuelle SERP-/Portal-Evidenz für Markt- und Wettbewerbsdichte
- Seller Intent vor reinem Traffic priorisiert
- quantitative Ubersuggest-Reports sind heute wegen ausgeschöpftem Tageslimit nicht vollständig verfügbar; daher keine erfundenen Volumina

## Strategische Priorität

### P1 – Boltenhagen

Reale Autocomplete-Cluster:
- immobilien boltenhagen
- immobilien boltenhagen kaufen
- immobilien boltenhagen ostsee
- immobilien boltenhagen und umgebung
- immobilien boltenhagen eigentumswohnung
- immobilien boltenhagen haus kaufen
- hausverkauf boltenhagen
- haus kaufen boltenhagen redewisch
- wohnung kaufen boltenhagen ostsee
- boltenhagen ferienwohnung verkauf
- immobilienpreise boltenhagen

Empfehlung:
- starke Regionsseite Boltenhagen
- Seller-Intent auf Immobilie/Haus verkaufen integrieren
- Ferien-/Zweitwohnsitz nur wenn Höhn das tatsächlich bedienen will
- Redewisch als Mikrolage zunächst innerhalb Boltenhagen abdecken

### P1 – Klütz / Klützer Winkel

Reale Cluster:
- immobilien klützer winkel
- immobilien klützer winkel kaufen
- immobilien klütz
- immobilien klütz kaufen
- immobilien klütz umgebung
- haus kaufen klützer winkel
- hausverkauf klütz

Empfehlung:
`Klützer Winkel` ist semantisch interessanter als nur Klütz und kann als regionaler Hub funktionieren.

### P1 – Kalkhorst / Groß Schwansee

Reale Cluster:
- immobilien kalkhorst
- immobilien kalkhorst kaufen
- kalkhorst grundstück kaufen
- immobilien groß schwansee
- immobilien groß schwansee kaufen
- grundstück kalkhorst

Strategischer Vorteil:
- direkte Küstennähe
- Grundstücks- und Hausmarkt
- Groß Schwansee mit hochpreisigen Küstenobjekten
- guter Fit zur Premium-Positionierung von Höhn

Empfehlung:
- Kalkhorst als Regionsseite
- Groß Schwansee als Premium-Mikrolage innerhalb der Seite, später ggf. eigene Seite bei ausreichender Evidenz
- Grundstücksverkauf/-bewertung als Seller-Funnel

### P1/P2 – Zierow / Wismarer Bucht

Reale Cluster:
- immobilien zierow
- immobilien zierow kaufen
- ostseeimmobilie zierow
- ferienimmobilie zierow
- reetdach ferienhaus zierow

Zierow ist klein, aber küstennah und zeigt aktuell einen aktiven Markt für Ferien-, Reetdach- und Ostseeimmobilien.

Empfehlung:
- keine generische Makler-Doorway-Page
- eher Küsten-/Ferien-/Ostseeimmobilien-Cluster, falls Geschäftsmodell passt

### P1/P2 – Grevesmühlen

Reale Cluster:
- immobilien grevesmühlen
- immobilien grevesmühlen kaufen
- immobilien grevesmühlen haus kaufen
- hausverkauf grevesmühlen
- haus zu verkaufen grevesmühlen
- haus kaufen grevesmühlen umgebung
- immobilienpreise grevesmühlen

Grevesmühlen besitzt einen breiteren normalen Wohnimmobilienmarkt und eignet sich eher für Verkäufer- und Haus-Intent als für Premium-Küstenbranding.

### P2 / Expansion – Wismar

Reale Cluster:
- immobilien wismar
- immobilien wismar kaufen
- immobilien wismar altstadt
- immobilien wismar altstadt kaufen
- immobilien wismar ostseeblick
- immobilien wismar und umgebung
- immobilienmakler wismar umgebung
- immobilienbewertung wismar
- immobilienmarktbericht wismar
- haus verkaufen wismar
- haus kaufen wismar ostseeblick
- wohnung verkaufen wismar
- wohnung kaufen wismar hafen
- wohnung kaufen wismar altstadt

Wismar hat das größte erkennbare Suchuniversum im östlichen 50-km-Korridor, aber auch deutlich stärkere lokale Konkurrenz.

Empfehlung:
- nicht als erstes Expansionsziel
- zunächst Küsten-/Nischengebiete zwischen Dassow und Wismar besetzen
- Wismar später mit eigenständigem Local-SEO-Blueprint angreifen

### P2 – Schönberg (Mecklenburg)

Reale Cluster:
- immobilien schönberg mecklenburg
- immobilien schönberg mv
- schönberg mecklenburg haus kaufen
- immobilien schönberg kaufen
- immobilien schönberg privat

Wichtig: Verwechslung mit Schönberg in Schleswig-Holstein vermeiden. Orts-/Bundesland-Disambiguierung zwingend.

## Nischen mit besonders gutem Fit für Höhn

1. Immobilien Groß Schwansee kaufen
2. Grundstück Kalkhorst kaufen / verkaufen
3. Immobilien Klützer Winkel
4. Hausverkauf Boltenhagen
5. Immobilien Boltenhagen Ostsee
6. Wohnung kaufen Boltenhagen Ostsee
7. Haus kaufen Boltenhagen Redewisch
8. Immobilien Zierow kaufen
9. Ostseeimmobilie / Ferienimmobilie Zierow
10. Hausverkauf Grevesmühlen
11. Immobilienpreise Grevesmühlen
12. Immobilien Wismar Ostseeblick
13. Wohnung kaufen Wismar Hafen
14. Immobilien Wismar Altstadt kaufen

## Empfohlene regionale Architektur

- `/regionen/boltenhagen/`
- `/regionen/kluetz-kluetzer-winkel/`
- `/regionen/kalkhorst-gross-schwansee/`
- `/regionen/grevesmuehlen/`
- `/regionen/zierow-wismarer-bucht/`

Wismar zunächst als Phase-B-Expansion:
- `/regionen/wismar/`
- Seller-/Marktunterseiten erst nach quantitativer Validierung

## Priorisierung für weitere quantitative Prüfung

Sobald wieder Ubersuggest-Reports verfügbar sind, zuerst messen:
1. immobilien boltenhagen
2. immobilienmakler boltenhagen
3. hausverkauf boltenhagen
4. immobilien klützer winkel
5. immobilien groß schwansee
6. immobilien kalkhorst
7. grundstück kalkhorst
8. immobilien grevesmühlen
9. hausverkauf grevesmühlen
10. immobilien zierow
11. immobilien wismar
12. immobilienbewertung wismar

Keine eigene Landingpage nur wegen Autocomplete. URL-Freigabe erst nach Intent-, SERP- und Content-Eignungsprüfung.