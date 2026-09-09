const replacements = new Map([
  [
    'Staging-Fassung. Die rechtlichen Pflichtangaben werden vor Deployment vollständig gegen die aktuelle Rechtslage und Unternehmensdaten geprüft.',
    'Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).',
  ],
  [
    'Diese Staging-Fassung bildet den aktuell vorgesehenen STRATO-Hosting- und Kontaktformular-Stack ab. Vor dem Livegang wird sie noch einmal gegen die tatsächlich aktivierte Produktionskonfiguration geprüft.',
    'Informationen zum Umgang mit personenbezogenen Daten auf der Website von Höhn Immobilien.',
  ],
  [
    'Stand dieser Staging-Fassung: 09.09.2026. Vor der Veröffentlichung wird die Erklärung noch einmal mit der tatsächlichen Hosting-, Mail-, Cookie- und Drittanbieter-Konfiguration des Produktivsystems abgeglichen.',
    'Stand: 09.09.2026. Diese Datenschutzhinweise beziehen sich auf die aktuell eingesetzte Hosting-, Mail-, Cookie- und Drittanbieter-Konfiguration der Website.',
  ],
  [
    'Der aktuelle Höhn-Bestand umfasst im Raum Dassow unter anderem Wohnimmobilien in Pötenitz sowie Grundstücksangebote in Rosenhagen. Welche Objekte verfügbar sind, zeigt ausschließlich die aktuelle Immobilienübersicht.',
    'Höhn Immobilien hat in der bisherigen Webpräsenz Wohnimmobilien in Pötenitz sowie Grundstücke in Rosenhagen geführt. Im Relaunch werden Angebote erst dann wieder als aktuell veröffentlicht, wenn ihre Verfügbarkeit und das aktuelle Höhn-Mandat frisch bestätigt sind.',
  ],
  [
    'Pötenitz und Rosenhagen sind Ortsteile von Dassow. Beide haben einen konkreten Bezug zum aktuellen Höhn-Angebot und werden deshalb mit eigenständigen Regionsseiten abgebildet.',
    'Pötenitz und Rosenhagen sind Ortsteile von Dassow und besitzen einen nachweisbaren Standort- beziehungsweise bisherigen Objektbezug zu Höhn Immobilien. Deshalb werden beide Regionen mit eigenständigen Regionsseiten abgebildet.',
  ],
  [
    'Zum aktuell öffentlich geführten Bestand gehören Wohnimmobilien in Pötenitz, darunter ein Einfamilienhaus und eine Eigentumswohnung. Preise, Status und Eckdaten werden im Neubau aus dem aktuellen Objektdatensatz übernommen.',
    'In der bisherigen Höhn-Webpräsenz wurden unter anderem ein Einfamilienhaus und eine Eigentumswohnung in Pötenitz geführt. Im Relaunch werden diese Angebote nicht als aktuell verfügbar beworben, solange Verfügbarkeit und aktuelles Höhn-Mandat nicht frisch bestätigt sind.',
  ],
  [
    'Pötenitz ist offiziell dem Stadtgebiet Dassow zugeordnet. Auch Rosenhagen gehört zu Dassow und ist über aktuelle Grundstücksangebote mit Höhn Immobilien verbunden.',
    'Pötenitz ist offiziell dem Stadtgebiet Dassow zugeordnet. Auch Rosenhagen gehört zu Dassow und besitzt durch bisherige Grundstücksangebote einen dokumentierten Bezug zu Höhn Immobilien.',
  ],
  [
    'Rosenhagen ist ein Ortsteil von Dassow mit direktem Küstenbezug. Für Höhn Immobilien ist die Region aktuell besonders durch konkrete Grundstücksangebote relevant.',
    'Rosenhagen ist ein Ortsteil von Dassow mit direktem Küstenbezug. Für Höhn Immobilien besteht ein dokumentierter regionaler und bisheriger Grundstücksbezug.',
  ],
  [
    'Auf der bestehenden Höhn-Website werden aktuell mehrere erschlossene Grundstücke in Rosenhagen geführt. Zusätzlich sind private Grundstücksangebote hinterlegt. Da sich Verkauf, Reservierung und Preise ändern können, werden diese Angaben auf der neuen Website aus dem aktuellen Objektdatensatz ausgespielt.',
    'Auf der bisherigen Höhn-Website wurden mehrere erschlossene Grundstücke in Rosenhagen sowie private Grundstücksangebote geführt. Diese Datensätze bleiben dokumentiert, werden im Relaunch aber erst nach frischer Prüfung von Verfügbarkeit und aktuellem Höhn-Mandat wieder als aktive Angebote veröffentlicht.',
  ],
  [
    'Höhn Immobilien besteht seit 1986. Auf der bestehenden Unternehmensseite werden Verkauf, Vermietung, Vermittlung und Projektierung als Tätigkeitsfelder genannt. Die neue Website konzentriert diese Erfahrung auf klare, nachvollziehbare Leistungs- und Objektseiten.',
    'Höhn Immobilien besteht seit 1986. Die neue Website konzentriert sich auf die belegten Maklerleistungen Verkauf, Vermietung und Vermittlung sowie auf nachvollziehbare Beratungs-, Bewertungs- und Vermarktungsprozesse.',
  ],
]);

function replaceText(value) {
  return typeof value === 'string' ? (replacements.get(value) ?? value) : value;
}

function deepReplace(value) {
  if (Array.isArray(value)) return value.map(deepReplace);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, deepReplace(entry)]));
  }
  return replaceText(value);
}

export function applyLaunchPageOverrides(sourcePage) {
  const page = deepReplace(sourcePage);

  if (page.slug === 'impressum') {
    page.blocks = [
      ...(page.blocks || []),
      {
        heading: 'Aufsichtsbehörde nach § 34c GewO',
        paragraphs: [
          'Amt Schönberger Land\nAm Markt 15\n23923 Schönberg\nTelefon: 038828 3300\nE-Mail: info@schoenberger-land.de',
        ],
      },
    ];
  }

  return page;
}
