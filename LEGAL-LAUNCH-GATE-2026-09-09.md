# Höhn Immobilien – Legal Launch Gate

Stand: 2026-09-09  
Status: **NUR NOCH PRODUKTIONSABGLEICH OFFEN**

Diese Datei ist eine technische/rechtliche Prüfliste für den Relaunch und keine Rechtsberatung oder Freigabe zur Veröffentlichung.

## 1. Sicher bekannte Unternehmensdaten

- Anbieter: Höhn Immobilien
- Inhaberin: Christine Bringmann
- Anschrift: Trakehnerstraße 11, 23942 Dassow OT Pötenitz
- Telefon: 038826 80911
- öffentliche E-Mail: `info@immo-hoehn.de`
- Christine Bringmann arbeitet allein; keine Beschäftigten
- keine USt-IdNr. / W-IdNr. für die Website vorhanden

Diese Angaben sind entweder öffentlich bestätigt oder vom Projektinhaber für den Relaunch ausdrücklich bestätigt.

## 2. § 5 DDG / Impressum

§ 5 DDG verlangt bei geschäftsmäßigen digitalen Diensten unter anderem Name/Anschrift, eine schnelle elektronische Kontaktmöglichkeit einschließlich E-Mail-Adresse und bei erlaubnispflichtigen Tätigkeiten Angaben zur zuständigen Aufsichtsbehörde.

Ein Register und eine Registernummer sind nur anzugeben, wenn tatsächlich eine entsprechende Registereintragung besteht. Eine USt-IdNr. oder W-IdNr. ist nur anzugeben, wenn eine solche Nummer tatsächlich vorhanden ist.

Offizielle Quelle:
- https://www.gesetze-im-internet.de/ddg/__5.html

Für Höhn Immobilien gilt nach aktuellem Research:

- kein belastbarer Handels-/Unternehmensregistereintrag für Christine Bringmann / Höhn Immobilien in Dassow-Pötenitz gefunden;
- keine Registerangabe wird übernommen;
- keine USt-IdNr. / W-IdNr. wird aufgenommen, da laut Projektinhaber nicht vorhanden;
- normale Steuernummern gehören nicht in das öffentliche Impressum.

## 3. § 34c GewO / Aufsichtsbehörde

Die gewerbsmäßige Vermittlung beziehungsweise der Nachweis von Verträgen über Grundstücke, grundstücksgleiche Rechte, gewerbliche Räume oder Wohnräume fällt unter § 34c GewO.

Offizielle Quelle:
- https://www.gesetze-im-internet.de/gewo/__34c.html

Die aktuell zuständige standortbezogene Aufsichtsbehörde für Dassow ist öffentlich bestätigt:

- Amt Schönberger Land
- Am Markt 15
- 23923 Schönberg
- Telefon: 038828 3300
- E-Mail: info@schoenberger-land.de

Offizielle Quelle:
- https://www.schoenberger-land.de/amtsangeh%C3%B6rige-St%C3%A4dte-Gemeinden/Stadt-Dassow/Wirtschaft/Ansprechpartner/index.php?FID=2618.314.1&ModID=10&object=tx%7C2618.2

Für das Website-Impressum ist die aktuell zuständige Aufsichtsbehörde maßgeblich. Die historische Erteilungsbehörde ist kein eigener Launch-Blocker.

Die vollständige §34c-Erlaubnisurkunde, ihr Erteilungsdatum, ein Aktenzeichen oder der komplette Tätigkeitskatalog werden nicht pauschal veröffentlicht. Eine echte Höhn-§34c-Erlaubnisurkunde wurde im aktuellen Chat und in der verfügbaren Library nicht gefunden. Das blockiert den aktuellen Makler-Webauftritt nicht.

Falls künftig ausdrücklich andere §34c-Tätigkeiten wie Bauträger, Baubetreuer oder Wohnimmobilienverwaltung beworben werden sollen, muss deren tatsächlicher Erlaubnisumfang vorher separat verifiziert werden.

## 4. Verbraucherstreitbeilegung

§ 36 Abs. 3 VSBG nimmt Unternehmer von der allgemeinen Informationspflicht nach § 36 Abs. 1 Nr. 1 aus, wenn am 31. Dezember des vorangegangenen Jahres zehn oder weniger Personen beschäftigt waren.

Christine Bringmann arbeitet allein. Damit liegt Höhn Immobilien klar unter dieser Schwelle.

Offizielle Quelle:
- https://www.gesetze-im-internet.de/vsbg/__36.html

Für die Website wird daher keine allgemeine Teilnahme-/Nichtteilnahme-Erklärung nach § 36 Abs. 1 Nr. 1 VSBG als Pflichttext aufgenommen.

Hinweis: § 37 VSBG enthält weiterhin Informationspflichten nach Entstehen einer konkreten, nicht beigelegten Verbraucherstreitigkeit. Das ist keine allgemeine Impressumsangabe.

## 5. EU-OS-/ODR-Plattform

Die frühere EU-OS-/ODR-Plattform wurde eingestellt. Der historische Link wird nicht in den Relaunch übernommen.

Offizielle Quelle:
- https://eur-lex.europa.eu/eli/reg/2024/3228/oj/deu

## 6. Datenschutz / Produktion

Bereits technisch festgelegt beziehungsweise geprüft:

- STRATO Hosting ist vorgesehen;
- Kontaktformular verwendet einen eigenen serverseitigen PHP-Endpunkt;
- Empfänger ist fest `info@immo-hoehn.de`;
- keine eigene Formulardatenbank vorgesehen;
- Honeypot statt externem Captcha;
- Webfonts werden lokal ausgeliefert;
- keine Google-Fonts-Verbindung im Relaunch-Build;
- aktuell keine eigenen Analyse-, Marketing- oder Profilingdienste vorgesehen;
- keine externen Maps/Embeds im aktuellen Relaunch-Build.

Vor Produktion noch real zu prüfen:

- tatsächliche STRATO-/Serverlog-Konfiguration;
- reale Mailzustellung des Formulars;
- Speicherdauer und interne Bearbeitung von Kontaktanfragen;
- spätere zusätzliche Drittanbieter nur, falls tatsächlich aktiviert.

## 7. Kontaktformular

Der Arbeitsbranch enthält einen First-Party-PHP-Endpunkt für STRATO-kompatibles Hosting:

- fester Empfänger: `info@immo-hoehn.de`;
- validierte Absender-E-Mail nur als `Reply-To`;
- Honeypot gegen einfache Bots;
- serverseitige Pflichtfeld-/Längenprüfung;
- keine externe Form-Service-Plattform;
- keine Speicherung der Anfrage in einer eigenen Datenbank vorgesehen;
- PHP-Syntax wird im CI geprüft;
- GET-/Invalid-POST-/Honeypot-Smoke-Tests laufen im CI, ohne eine echte Mail auszulösen;
- Formularcheckbox dokumentiert die Kenntnisnahme der Datenschutzerklärung und konstruiert keine unnötige Einwilligungsgrundlage.

Die tatsächliche Mailzustellung muss vor Launch auf dem echten Höhn-Webspace getestet werden.

## 8. Gate

**Bekannte Unternehmensstammdaten: PASS**  
**aktuelle §34c-Aufsichtsbehörde: PASS – Amt Schönberger Land**  
**historische Erteilungsbehörde als Website-Pflicht: RESOLVED / NICHT ERFORDERLICH**  
**vollständige §34c-Urkunde: für aktuellen Makler-Webauftritt kein eigener Publikationsblocker**  
**Registerangabe: RESOLVED – kein passender öffentlicher Eintrag gefunden**  
**USt-IdNr./W-IdNr.: RESOLVED – laut Projektinhaber nicht vorhanden, daher keine Angabe**  
**VSBG §36 allgemeine Website-Informationspflicht: RESOLVED – allein tätig / <=10 Personen**  
**ODR-Altlink: REMOVE**  
**Kontaktformular Source-/CI-Gate: PASS; echte Mailzustellung auf STRATO noch offen**  
**Datenschutz technisch weitgehend vorbereitet; finaler Produktionsabgleich bleibt offen**  
**Produktionsfreigabe Rechtsseiten: nur noch Produktionsabgleich offen**

## 9. Font-/Drittanbieter-Gate

**PASS:** Caveat, Cormorant Garamond und DM Sans werden im Relaunch lokal über Fontsource-Pakete ausgeliefert. Die früher im Layout vorhandenen Verbindungen zu `fonts.googleapis.com` und `fonts.gstatic.com` wurden entfernt. Build, Multi-Viewport-QA und Lighthouse wurden anschließend erneut erfolgreich ausgeführt.
