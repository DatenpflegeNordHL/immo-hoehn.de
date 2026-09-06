# MASTER BUILD PROMPT – HÖHN IMMOBILIEN

Stand: 2026-09-07
Arbeitsbranch: `redesign/coastal-blueprint`
Produktionsbranch: `main`

## Projektziel

Die neue Website für immo-hoehn.de wird als hochwertige, regionale Immobilienmakler-Website für die Ostseeküste aufgebaut. Primäres Geschäftsziel sind qualifizierte Eigentümer-Leads für Immobilienverkauf und Wertermittlung. Käuferanfragen, regionale Markenautorität, Local SEO und AI-/GEO-Sichtbarkeit sind sekundäre Ziele.

Die Wartungs-/Produktionsversion auf `main` darf bis zur finalen Freigabe nicht überschrieben werden.

## Verbindliche Pipeline

`Evidence → Keyword Research → SERP/Competitor Mapping → Keyword-to-URL Mapping → Information Architecture → Content Blueprints → Design/Build → Technical SEO → Local SEO → GEO/AEO → CRO → QA → Deployment`

Kein Seitentyp wird ausschließlich aus Designgründen gebaut. Jede relevante URL benötigt einen klaren Nutzer-, Such- oder Conversion-Zweck.

---

# LEVEL 0 – EVIDENCE & BUSINESS CONTEXT

Vor Änderungen vorhandene Evidenz prüfen:

- Geschäftsmodell
- Leistungen
- tatsächliche Zielregion
- Unternehmenshistorie
- Standort und Kontakt
- Immobilienarten
- aktuelle Angebote / Referenzen
- Zielgruppen
- bestehende URLs
- technische Altlasten
- Local-/Brand-Signale
- relevante Wettbewerber

Bereits bestätigte Fakten nicht unnötig erneut recherchieren. Unsichere Fakten kennzeichnen.

---

# LEVEL 1 – MASTER KEYWORD RESEARCH

Keyword Research findet vor finaler Sitemap, Content und Astro-Build statt.

Quellenpriorität:

1. Semrush / vergleichbare quantitative SEO-Daten
2. Google Search Console, falls verfügbar
3. Google Keyword Planner
4. aktuelle Google-SERPs
5. Wettbewerberseiten
6. Immobilienportale für Angebots-/Marktindikation

Keine Suchvolumina erfinden.

Cluster mindestens:

## Seller / Eigentümer

- Immobilienmakler + Ort
- Makler + Ort
- Immobilie verkaufen + Ort
- Haus verkaufen + Ort
- Wohnung verkaufen + Ort
- Grundstück verkaufen + Ort
- Immobilienbewertung + Ort
- Haus bewerten + Ort
- Wohnung bewerten + Ort
- Grundstück bewerten + Ort
- Immobilienmakler Ostseeküste
- Immobilie verkaufen Ostseeküste

Seller Intent erhält höchste Priorität.

## Buyer

- Immobilien + Ort
- Immobilie kaufen + Ort
- Haus kaufen + Ort
- Wohnung kaufen + Ort
- Grundstück kaufen + Ort
- Immobilie Ostsee kaufen
- Haus Ostseeküste kaufen

Buyer Keywords nicht künstlich gegen dominante Portale aufblasen. Objektdetails und Regionsseiten bevorzugen.

## Local

Kerngebiete:

- Travemünde
- Priwall
- Dassow
- Pötenitz
- Rosenhagen

Expansion nur bei tatsächlicher Geschäftstätigkeit und belegbarer lokaler Kompetenz:

- Harkensee
- Barendorf
- Kalkhorst
- Klütz
- Boltenhagen
- weitere Küstenorte

## Informational / Authority

Nur Themen mit Seller-, Local- oder Authority-Wert:

- Immobilienpreise + Ort
- Quadratmeterpreis + Ort
- Immobilienmarkt + Ort
- Maklerprovision Schleswig-Holstein
- Maklerprovision Mecklenburg-Vorpommern
- Immobilie geerbt verkaufen
- Immobilie bei Scheidung verkaufen
- diskreter Immobilienverkauf
- Grundstück verkaufen Ostseeküste

---

# LEVEL 2 – SERP & COMPETITOR MAPPING

Für strategische Keywords reale SERPs prüfen.

Erfassen:

- Search Intent
- dominante Seitentypen
- lokale Ergebnisse
- Portale
- lokale Makler
- Bewertungsdienste
- Marktberichte
- SERP Features
- relevante Content-Blöcke
- Wettbewerberstruktur

Wettbewerber unterscheiden:

1. Business Competitors
2. SEO Competitors
3. Local Competitors
4. Portal Competitors
5. AI/GEO Entity Competitors

Prioritäten:

- P0 = geschäftskritisch
- P1 = hoher Lead-/Ranking-Wert
- P2 = unterstützend
- P3 = Expansion / optional

---

# LEVEL 3 – KEYWORD-TO-URL MAPPING

Jedes strategische Keyword erhält eine definierte Zielseite.

Regeln:

- keine unnötige Kannibalisierung
- Varianten mit gleicher Suchintention clustern
- keine Landingpage pro Keywordvariation
- keine Copy/Paste-Ortsseiten
- kleine Mikrolagen dürfen Regionsseiten sein, ohne künstlich auf `Immobilienmakler + Ort` optimiert zu werden

Pro URL definieren:

- Primary Keyword
- Secondary Keywords
- Search Intent
- Zielgruppe
- Conversion-Ziel
- interne Links
- Entities
- Trust-/Evidence-Anforderungen

Die verbindliche aktuelle Keyword-/URL-Map liegt in `MASTER-KEYWORD-RESEARCH.md`.

---

# LEVEL 4 – INFORMATION ARCHITECTURE

Finale Seitenstruktur erst nach Keyword Research festlegen.

Aktuelle Phase-A-Struktur:

```text
/
├── immobilien/
│   └── [objekt-slug]/
├── immobilie-verkaufen/
├── immobilienbewertung/
├── grundstueck-verkaufen/        [P1]
├── regionen/
│   ├── travemuende/
│   ├── priwall/
│   ├── dassow/
│   ├── poetenitz/
│   └── rosenhagen/
├── markt/
│   ├── immobilienpreise-travemuende/  [Phase B]
│   └── immobilienpreise-dassow/       [Phase B]
├── ueber-uns/
├── kontakt/
├── impressum/
└── datenschutz/
```

Spezialseiten wie `haus-verkaufen-travemuende` und `wohnung-verkaufen-travemuende` erst nach quantitativer SERP-/Volumenvalidierung anlegen.

---

# LEVEL 5 – CONTENT BLUEPRINT

Vor dem Schreiben jeder Seite Blueprint erstellen.

## SEO

- Primary Keyword
- Secondary Keywords
- Entities
- Search Intent
- Title
- Meta Description
- H1
- H2/H3

## Nutzer

- zentrale Frage
- Problem
- gewünschte Handlung
- Trust-Signale

## Conversion

- Primary CTA
- Secondary CTA
- Kontaktweg
- Bewertungs-/Verkaufsoption

## Evidence

Keine unbelegten Superlative oder Claims.

Nicht ohne Nachweis verwenden:

- Marktführer
- bester Makler
- führender Makler
- größtes Käufernetzwerk
- Höchstpreisgarantie
- schnellster Verkauf

---

# LEVEL 6 – LOCAL SEO

Jede echte Regionsseite muss einzigartigen lokalen Inhalt besitzen.

Mögliche Inhalte:

- Lagecharakter
- Immobilienarten
- typische Mikrolagen
- Eigentümerperspektive
- Käuferprofile
- Grundstückslagen
- Küsten-/Wasserbezug
- lokale Besonderheiten
- echte Höhn-Erfahrung / Referenzen

Keine Doorway Pages.

NAP-Daten konsistent halten.

Google Business Profile und relevante lokale Verzeichnisse später gegen Website-Daten prüfen.

---

# LEVEL 7 – GEO / AEO / AI SEARCH

Website so strukturieren, dass Suchmaschinen und LLMs klare Aussagen extrahieren können.

Bevorzugen:

- klare Unternehmensidentität
- eindeutige Ortsbeziehungen
- konkrete Leistungsbeschreibungen
- kurze faktische Antwortblöcke
- nachvollziehbare Quellen bei Marktdaten
- strukturierte FAQs nur bei echtem Nutzerbedarf
- konsistente Entity-Signale
- interne semantische Verknüpfungen

Kernentity:

`Höhn Immobilien → Immobilienmakler → Ostseeküste → Travemünde / Priwall / Dassow / Pötenitz / Rosenhagen → Immobilienverkauf / Wertermittlung / Vermittlung`

---

# LEVEL 8 – DESIGN & ASTRO BUILD

Freigegebene Coastal-Blueprint-Designsprache beibehalten.

Designziel:

- hochwertige Maklerästhetik
- regional
- ruhig
- vertrauenswürdig
- Küstenbezug ohne Ferienportal-Look
- nicht generisch

Technik:

- Astro
- semantisches HTML
- möglichst wenig Client-JavaScript
- responsive Images
- AVIF/WebP
- `srcset`
- korrektes LCP-Handling
- Lazy Loading unterhalb Fold

Komponenten sinnvoll aufteilen:

- Header
- Hero
- PropertyGrid
- PropertyCard
- RegionSection
- SellerSection
- ValuationCTA
- HeritageSection
- ContactSection
- Footer

Preview-Geometrie nicht unkontrolliert neu bauen. `preview/styles-base.css` ist die validierte Geometriebasis; `preview/styles.css` enthält nachgelagerte Media-/Image-Kalibrierungen.

---

# LEVEL 9 – TECHNICAL SEO

Vor Produktion prüfen:

- Canonicals
- robots.txt
- sitemap.xml
- Statuscodes
- alte URL-Redirects
- Title
- Meta Descriptions
- Open Graph
- Social Cards
- interne Verlinkung
- Crawl Depth
- Indexability
- Duplicate Content
- Breadcrumbs

Structured Data nur semantisch korrekt einsetzen:

- Organization
- RealEstateAgent / LocalBusiness
- WebSite
- WebPage
- BreadcrumbList
- passende Angebots-/Objektdaten nur wenn vollständig und korrekt

Kein Fake-Schema.

---

# LEVEL 10 – PERFORMANCE

Zielwerte:

- LCP < 2,5 s
- INP < 200 ms
- CLS < 0,1

Prüfen:

- Bilder
- Font Loading
- Critical CSS
- Render Blocking
- JavaScript
- Caching
- Kompression
- Serverantwortzeit
- Third-Party Scripts
- Layout Shift

---

# LEVEL 11 – CRO

Primärer Funnel:

`Eigentümer → lokale Kompetenz → Vertrauen → Bewertung / Verkaufsberatung → Kontakt`

Prüfen:

- Seller CTA im Hero
- Immobilie anbieten
- Wertermittlung
- Kontakt
- Telefon
- E-Mail
- Formular
- Mobile UX
- Social Proof nur mit echten Daten

Käufer-Funnel separat, aber sekundär behandeln.

---

# LEVEL 12 – QA

Desktop:

- 1024
- 1280
- 1440
- 1920

Tablet:

- 768
- 820

Mobile:

- 360
- 390
- 412
- 430

Prüfen:

- Layout
- Overflow
- Typografie
- Navigation
- Fokuszustände
- Tastaturbedienung
- Kontrast
- Formulare
- Links
- Bilder
- ALT
- Lighthouse
- Core Web Vitals

---

# LEVEL 13 – FINAL SEO / CONTENT VALIDATION

Vor Deployment beantworten:

1. Hat jede Index-URL einen echten Such-/Nutzerzweck?
2. Gibt es Keyword-Kannibalisierung?
3. Gibt es Thin Pages?
4. Sind Regionsseiten einzigartig?
5. Sind P0-/P1-Seller-Keywords abgedeckt?
6. Ist die interne Linkarchitektur logisch?
7. Sind Aussagen belegt?
8. Versteht Google klar, wer Höhn Immobilien ist und wo Höhn tätig ist?
9. Versteht ein LLM die Beziehung zwischen Höhn, Leistungen und Regionen?
10. Sind Conversion-Pfade messbar und technisch funktionsfähig?

---

# LEVEL 14 – DEPLOYMENT

Erst nach Freigabe:

`redesign/coastal-blueprint → Produktionsstruktur → Build → QA → main → Deployment`

Vorher:

- alte WordPress-Version sichern
- Redirect Mapping fertigstellen
- Rollback sicherstellen

Nach Deployment:

- Statuscodes
- Sitemap
- robots
- Canonicals
- Structured Data
- Formulare
- Analytics / Search Console
- Core Web Vitals
- Conversion Tracking

prüfen.

---

# STATUSFORMAT NACH JEDEM LEVEL

## Erledigt
Nur tatsächlich abgeschlossene Arbeit.

## Findings
Neue belegte Erkenntnisse.

## Änderungen
Dateien / URLs / Komponenten.

## Offen
Noch nicht erledigte Punkte.

## Risiken
SEO-, Content-, Technik- oder Deployment-Risiken.

## Nächster Schritt
Genau der nächste sinnvolle Arbeitsschritt.

Keine bereits erledigten Aufgaben ohne Anlass wiederholen.
