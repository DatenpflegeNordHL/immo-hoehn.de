# Astro Build – Staging Safeguards

Stand: 2026-09-09

- Branch: `redesign/coastal-blueprint`
- `main` bleibt unberührt.
- Der Astro-Build ist standardmäßig `noindex,nofollow`.
- Produktion erst mit `PUBLIC_SITE_NOINDEX=false` bauen.
- Kontaktformular ist im Staging absichtlich noch ohne Versand.
- Live-Empfänger muss ausschließlich `info@immo-hoehn.de` sein.
- Travemünde und Priwall bleiben CONDITIONAL und werden nicht als nachgewiesene Höhn-Kernregionen ausgegeben.
- Objekt-Seed-Daten sind am 09.09.2026 gegen öffentliche First-Party-Seiten geprüft und müssen vor Deployment erneut verifiziert werden.
- Impressum und Datenschutz sind Staging-Platzhalter und bleiben `noindex`, bis die aktuelle rechtliche Fassung geprüft wurde.

Build:

```bash
npm install
npm run build
```

Preview:

```bash
npm run dev
```
