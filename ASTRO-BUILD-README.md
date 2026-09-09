# Astro Build – Staging Safeguards

Stand: 2026-09-09

- Branch: `redesign/coastal-blueprint`
- `main` bleibt unberührt.
- Toolchain: Astro `^7.3.2`, `@astrojs/sitemap ^3.7.4`.
- Node: gerade Version ab `22.12.0`; `.nvmrc` verwendet Node 22.
- Der Astro-Build ist standardmäßig `noindex,nofollow`.
- Produktion erst mit `PUBLIC_SITE_NOINDEX=false` bauen.
- Kontaktformular ist im Staging absichtlich noch ohne Versand.
- Live-Empfänger muss ausschließlich `info@immo-hoehn.de` sein.
- Travemünde und Priwall sind ab 09.09.2026 als lokale Tätigkeitsbereiche freigegeben.
- Für Travemünde/Priwall werden keine nicht belegten Büros, historischen Referenzen oder aktuellen Objekte behauptet.
- Objekt-Seed-Daten sind am 09.09.2026 gegen öffentliche First-Party-Seiten geprüft und müssen vor Deployment erneut verifiziert werden.
- Impressum und Datenschutz sind Staging-Platzhalter und bleiben `noindex`, bis die aktuelle rechtliche Fassung geprüft wurde.

## Freigegebene Regionsstruktur

- Dassow
- Pötenitz
- Rosenhagen
- Travemünde
- Priwall

## Build

```bash
nvm use
npm install
npm run build
```

## Preview

```bash
npm run dev
```

## Produktionsbuild erst nach QA/Freigabe

```bash
PUBLIC_SITE_NOINDEX=false npm run build
```
