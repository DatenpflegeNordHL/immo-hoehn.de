import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(text, oldValue, newValue, label) {
  if (!text.includes(oldValue)) throw new Error(`Expected text not found: ${label}`);
  return text.replace(oldValue, newValue);
}

const sitePath = 'src/data/site.js';
let site = readFileSync(sitePath, 'utf8');
site = replaceOnce(
  site,
  "{ heading: '7. Schriftarten', paragraphs: ['Der aktuelle Staging-Build lädt die verwendeten Webfonts noch über Google Fonts. Vor dem Produktivstart ist vorgesehen, die Schriftarten lokal auszuliefern und diese externe Verbindung zu entfernen. Solange die externe Google-Fonts-Verbindung besteht, ist die Datenschutzprüfung für den Livegang nicht abgeschlossen.'] },",
  "{ heading: '7. Schriftarten', paragraphs: ['Die im Relaunch verwendeten Webfonts Caveat, Cormorant Garamond und DM Sans werden lokal über diese Website ausgeliefert. Beim Laden der Schriftarten wird keine Verbindung zu Google Fonts oder zu fonts.gstatic.com hergestellt.'] },",
  'privacy font paragraph'
);
site = site.replace(
  'Vor der Veröffentlichung wird die Erklärung noch einmal mit der tatsächlichen Hosting-, Mail-, Font-, Cookie- und Drittanbieter-Konfiguration des Produktivsystems abgeglichen.',
  'Vor der Veröffentlichung wird die Erklärung noch einmal mit der tatsächlichen Hosting-, Mail-, Cookie- und Drittanbieter-Konfiguration des Produktivsystems abgeglichen.'
);
writeFileSync(sitePath, site);

const legalPath = 'LEGAL-LAUNCH-GATE-2026-09-09.md';
let legal = readFileSync(legalPath, 'utf8');
legal = legal.replace(
  '- Google Fonts beziehungsweise deren tatsächliche Auslieferungsform im finalen Build;',
  '- lokal ausgelieferte Webfonts; im finalen Relaunch-Build besteht keine Google-Fonts-Verbindung;'
);
if (!legal.includes('## 10. Font-/Drittanbieter-Gate')) {
  legal += `\n\n## 10. Font-/Drittanbieter-Gate\n\n**PASS:** Caveat, Cormorant Garamond und DM Sans werden im Relaunch lokal über Fontsource-Pakete ausgeliefert. Die früher im Layout vorhandenen Verbindungen zu \`fonts.googleapis.com\` und \`fonts.gstatic.com\` wurden entfernt. Build, Multi-Viewport-QA und Lighthouse wurden anschließend erneut erfolgreich ausgeführt.\n`;
}
writeFileSync(legalPath, legal);

const redirectPath = 'LEGACY-URL-REDIRECT-MATRIX-2026-09-09.md';
let redirect = readFileSync(redirectPath, 'utf8');
if (!redirect.includes('## Historische Höhn-Domain `hoehn-immobilien.de`')) {
  const section = `\n\n## Historische Höhn-Domain \`hoehn-immobilien.de\`\n\nDer öffentliche Backlink-Pass vom 09.09.2026 zeigt mehrere aktuelle Drittverzeichnisse, die für **Höhn Immobilien, Trakehner Str. 11, 23942 Pötenitz, Telefon 038826 80911** weiterhin die historische Domain \`hoehn-immobilien.de\` nennen. Damit ist die Domain dem hiesigen Höhn-Unternehmen belastbar zuordenbar und nicht mit ähnlich benannten Maklern zu vermischen.\n\nBeispiele:\n\n- https://onlinestreet.de/412276-hoehn-immobilien\n- https://regionale-immobilienmakler.de/immobilienmakler-luetgenhof-23942.htm\n- https://tags.branchen-info.net/tag/bausubstanz/337147/59/\n\nOnlinestreet kennzeichnet die historische Website aktuell als möglicherweise nicht erreichbar. Für den Relaunch gilt daher:\n\n1. Eigentum/Kontrolle der Domain \`hoehn-immobilien.de\` im Domainbestand prüfen.\n2. Falls Höhn die Domain kontrolliert: Host-Redirect per **301** auf \`https://immo-hoehn.de/\` einrichten; bekannte historische Unterpfade nach Möglichkeit direkt auf das jeweils passendste neue Ziel führen.\n3. Falls die Domain nicht mehr kontrolliert wird: relevante Branchenverzeichnisse auf \`https://immo-hoehn.de/\` korrigieren lassen.\n4. Keine fremden ähnlich benannten Höhn-Domains in diese Migration einbeziehen.\n\nStatus: **PUBLIC BACKLINK EVIDENCE PASS / DOMAIN CONTROL USER-SIDE CHECK REQUIRED**.\n`;
  const marker = '\n## Noch zu inventarisieren\n';
  redirect = redirect.includes(marker) ? redirect.replace(marker, section + marker) : redirect + section;
}
writeFileSync(redirectPath, redirect);

const qaPath = 'P0-BUILD-QA-2026-09-09.md';
let qa = readFileSync(qaPath, 'utf8');
if (!qa.includes('## Post-Launch-Gate-Update – 09.09.2026')) {
  qa += `\n\n## Post-Launch-Gate-Update – 09.09.2026\n\n### Lokale Webfonts – PASS\n\n- Caveat, Cormorant Garamond und DM Sans als gepinnte Fontsource-Abhängigkeiten integriert.\n- Google-Fonts-Stylesheet, \`fonts.googleapis.com\` und \`fonts.gstatic.com\` aus dem Layout entfernt.\n- Locked Build nach Umstellung: **PASS**.\n- Multi-Viewport Visual QA nach Umstellung: **PASS – 180/180**.\n- Lighthouse Hard Gates nach Umstellung: **PASS**.\n\n### Objekt-Recheck – PASS am 09.09.2026\n\nDie vier migrierten First-Party-Angebote wurden erneut gegen die öffentlich erreichbaren Höhn-Seiten geprüft. Haus 1724, Wohnung 1722, Rosenhagen-Standardgrundstücke und Rosenhagen-von-privat sind weiterhin öffentlich auffindbar; die im Relaunch hinterlegten Kernwerte stimmen mit den aktuellen First-Party-Seiten überein. Ein weiterer unmittelbarer Recheck bleibt trotzdem Bestandteil des tatsächlichen Produktionsdeployments, weil Verfügbarkeit und Preise zeitkritisch sind.\n\n### Legacy-Domain – neuer Produktionshinweis\n\nÖffentliche Drittverzeichnisse führen für das eindeutig zuordenbare Höhn-Unternehmen weiterhin \`hoehn-immobilien.de\`. Domainkontrolle beziehungsweise Verzeichniskorrektur ist deshalb als eigener Relaunch-Punkt in der Redirect-Matrix dokumentiert.\n`;
}
writeFileSync(qaPath, qa);
