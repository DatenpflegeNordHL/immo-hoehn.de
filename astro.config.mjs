import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { properties } from './src/data/properties.js';
import { PUBLISH_PROPERTY_LISTINGS } from './src/data/launch-config.js';

const unpublishedPropertyUrls = new Set(
  PUBLISH_PROPERTY_LISTINGS
    ? []
    : properties.map((property) => `https://immo-hoehn.de/immobilien/${property.slug}/`),
);

export default defineConfig({
  site: 'https://immo-hoehn.de',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.endsWith('/impressum/')
        && !page.endsWith('/datenschutz/')
        && !unpublishedPropertyUrls.has(page),
    }),
  ],
});
