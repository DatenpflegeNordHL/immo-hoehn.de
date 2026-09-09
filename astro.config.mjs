import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://immo-hoehn.de',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
