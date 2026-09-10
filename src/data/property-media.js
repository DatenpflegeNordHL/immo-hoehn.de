export const propertyMedia = {
  'einfamilienhaus-poetenitz-1724': {
    src: '/assets/hero-coast-960.webp',
    alt: 'Küstenlage bei Pötenitz an der Ostsee',
    label: 'Lagebild Pötenitz',
    kind: 'location',
    gallery: [],
  },
  'eigentumswohnung-poetenitz-1722': {
    src: 'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/poetenitz-25-05-06-03-high.jpg',
    alt: 'Eigentumswohnung in Pötenitz aus dem bisherigen Höhn-Objektbestand',
    label: 'Objektbild Bestand',
    kind: 'property',
    gallery: [
      'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/25-1722-02-wohnzimmer-high.jpg',
      'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/25-1722-04-wohnen-kochen-high.jpg',
      'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/25-1722-05-schlafzimmer-high.jpg',
      'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/25-1722-08-terrasse-high.jpg',
      'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/25-1722-10-strand-blick-travemuende-high.jpg',
    ],
  },
  'baugrundstuecke-rosenhagen': {
    src: 'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/wohnen-wie-im-urlaub-210302-rosenhagen-front-high.jpg',
    alt: 'Projektansicht der Baugrundstücke in Rosenhagen aus dem bisherigen Höhn-Bestand',
    label: 'Projektansicht Bestand',
    kind: 'property',
    gallery: [
      'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/rosenhagen-210209-projekt-4-grundstuecke-high.jpg',
    ],
  },
  'baugrundstuecke-rosenhagen-von-privat': {
    src: 'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/rosenhagen-210209-projekt-4-grundstuecke-high.jpg',
    alt: 'Übersicht der Grundstückslage in Rosenhagen aus dem bisherigen Höhn-Bestand',
    label: 'Bestandsbild Rosenhagen',
    kind: 'property',
    gallery: [
      'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs/wohnen-wie-im-urlaub-210302-rosenhagen-front-high.jpg',
    ],
  },
};

export function getPropertyMedia(slug) {
  return propertyMedia[slug] ?? null;
}
