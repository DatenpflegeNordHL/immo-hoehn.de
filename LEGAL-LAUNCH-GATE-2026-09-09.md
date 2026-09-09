# Höhn Immobilien – Legal Launch Gate

Stand: 2026-09-09  
Status: **BLOCKED BIS UNTERNEHMENSSPEZIFISCHE PFLICHTDATEN VERIFIZIERT SIND**

Diese Datei ist eine technische/rechtliche Prüfliste für den Relaunch und keine Rechtsberatung oder Freigabe zur Veröffentlichung.

## 1. Bereits sicher bekannte Unternehmensdaten

- Anbieter: Höhn Immobilien
- Inhaberin: Christine Bringmann
- Anschrift: Trakehnerstraße 11, 23942 Dassow OT Pötenitz
- Telefon: 038826 80911
- öffentliche E-Mail: `info@immo-hoehn.de`

Diese Daten sind auf der aktuellen First-Party-Website öffentlich bestätigt.

## 2. Warum das alte Impressum nicht übernommen werden darf

Das bestehende öffentliche Impressum enthält aktuell unter anderem:

- leeres Feld `Genehmigung:`
- leeres Feld `Primäre Tätigkeitsregion:`
- den veralteten Verweis `Verantwortlich ... gemäß § 6 MDStV`
- einen historischen Hinweis auf die EU-Plattform zur Online-Streitbeilegung

Diese Fassung darf nicht ungeprüft in den Relaunch kopiert werden.

## 3. Aktueller gesetzlicher Prüfrahmen

### § 5 Digitale-Dienste-Gesetz (DDG)

§ 5 DDG verlangt bei geschäftsmäßigen digitalen Diensten unter anderem Name/Anschrift sowie eine schnelle elektronische Kontaktmöglichkeit einschließlich E-Mail-Adresse.

Soweit die angebotene Tätigkeit einer behördlichen Zulassung bedarf, verlangt § 5 Abs. 1 Nr. 3 DDG außerdem Angaben zur zuständigen Aufsichtsbehörde.

Offizielle Quelle:
- https://www.gesetze-im-internet.de/ddg/__5.html

### § 34c Gewerbeordnung

Die gewerbsmäßige Vermittlung beziehungsweise der Nachweis von Verträgen über Grundstücke, grundstücksgleiche Rechte, gewerbliche Räume oder Wohnräume fällt unter § 34c GewO.

Offizielle Quelle:
- https://www.gesetze-im-internet.de/gewo/__34c.html

## 4. Vor Livegang zwingend zu verifizieren

Nicht erfinden, sondern aus aktuellen Höhn-Unterlagen / Gewerbeerlaubnis / zuständiger Behörde übernehmen:

1. genaue §34c-Genehmigungs-/Erlaubnisangabe;
2. zuständige Aufsichtsbehörde;
3. vollständige Anschrift der zuständigen Aufsichtsbehörde, soweit für die Darstellung erforderlich;
4. gegebenenfalls Register und Registernummer, falls für Höhn Immobilien tatsächlich vorhanden und impressumspflichtig;
5. Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer nur dann, wenn tatsächlich vorhanden und nach § 5 DDG anzugeben;
6. aktuelle Angaben zur Verbraucherstreitbeilegung, soweit für das Unternehmen einschlägig;
7. Verantwortlichkeit für journalistisch-redaktionelle Inhalte nur anhand des tatsächlich einschlägigen aktuellen Rechts und des realen Website-Inhalts.

## 5. EU-OS-/ODR-Plattform – alter Link entfernen

Die Verordnung (EU) 2024/3228 hat die frühere ODR-Verordnung mit Wirkung vom **20.07.2025** aufgehoben. Die EU-OS-Plattform wurde eingestellt; neue Beschwerden konnten bereits seit 20.03.2025 nicht mehr eingereicht werden.

Der alte OS-/ODR-Link darf deshalb nicht als historischer Standardtext in das neue Impressum übernommen werden.

Offizielle Quelle:
- https://eur-lex.europa.eu/eli/reg/2024/3228/oj/deu

## 6. Datenschutz – Relaunch-Abhängigkeiten

Die finale Datenschutzerklärung darf erst nach Festlegung des echten Produktionssystems abgeschlossen werden.

Mindestens zu prüfen:

- STRATO Hosting / Serverlogs;
- Kontaktformular;
- Empfänger `info@immo-hoehn.de`;
- serverseitiger PHP-Mailversand;
- Google Fonts beziehungsweise deren tatsächliche Auslieferungsform im finalen Build;
- Analytics nur falls tatsächlich eingesetzt;
- Maps/Embeds nur falls tatsächlich eingesetzt;
- Cookies/Consent nur für tatsächlich verwendete Technologien;
- Speicherdauer und interne Bearbeitung von Kontaktanfragen;
- externe Immobilienportale/Verlinkungen, soweit datenschutzrechtlich relevant.

## 7. Kontaktformular – aktueller technischer Stand

Der Arbeitsbranch enthält einen First-Party-PHP-Endpunkt für STRATO-kompatibles Hosting:

- fester Empfänger: `info@immo-hoehn.de`;
- validierte Absender-E-Mail nur als `Reply-To`;
- Honeypot gegen einfache Bots;
- serverseitige Pflichtfeld-/Längenprüfung;
- keine externe Form-Service-Plattform;
- keine Speicherung der Anfrage in einer eigenen Datenbank vorgesehen.

Die tatsächliche Mailzustellung muss vor Launch auf dem echten Höhn-Webspace getestet werden.

## 8. Gate

**Bekannte Unternehmensstammdaten: PASS**  
**alte Rechtsseite als Quelle für Relaunch: FAIL / NICHT ÜBERNEHMEN**  
**§34c-Erlaubnisdetails: MISSING**  
**zuständige Aufsichtsbehörde: MISSING**  
**ODR-Altlink: REMOVE**  
**Datenschutz final: BLOCKED bis Produktionsstack feststeht**  
**Produktionsfreigabe der Rechtsseiten: BLOCKED**
