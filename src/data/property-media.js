const image = (src, alt, caption, kind = 'project') => ({ src, alt, caption, kind });

export const propertyMedia = {
  'grundstuecke-rosenhagen-623-743': {
    hero: image(
      '/assets/wp02/rosenhagen-projekt.webp',
      'Luftaufnahme der Grundstücksangebote in Rosenhagen',
      'Luftaufnahme Rosenhagen',
    ),
    gallery: [
      image(
        '/assets/wp02/rosenhagen-projekt.webp',
        'Luftaufnahme der Grundstücksangebote in Rosenhagen',
        'Luftaufnahme Rosenhagen',
      ),
      image(
        '/assets/wp02/rosenhagen-kataster.png',
        'Katasterausschnitt zu den Grundstücksangeboten in Rosenhagen',
        'Katasterausschnitt',
        'plan',
      ),
    ],
  },

  'baugrundstuecke-rosenhagen-1599-1999': {
    hero: image(
      '/assets/wp02/rosenhagen-luftbild.webp',
      'Luftaufnahme zur Lage der beiden Baugrundstücke in Rosenhagen',
      'Luftaufnahme Rosenhagen',
    ),
    gallery: [
      image(
        '/assets/wp02/rosenhagen-luftbild.webp',
        'Luftaufnahme zur Lage der beiden Baugrundstücke in Rosenhagen',
        'Luftaufnahme und Grundstückslage',
      ),
      image(
        '/assets/wp02/strandvilla-visualisierung.webp',
        'Visualisierung einer möglichen Bebauung in Rosenhagen',
        'Beispielhafte Visualisierung, KI-generiert',
        'visualization',
      ),
      image(
        '/assets/wp02/terrasse-visualisierung.png',
        'Visualisierung einer möglichen Garten- und Terrassengestaltung in Rosenhagen',
        'Beispielhafte Visualisierung, KI-generiert',
        'visualization',
      ),
      image(
        '/assets/wp02/rosenhagen-strand-1.webp',
        'Naturstrand an der Ostseeküste bei Rosenhagen',
        'Naturstrand und Küstenlage',
        'location',
      ),
      image(
        '/assets/wp02/rosenhagen-strand-4.webp',
        'Ostseeküste bei Rosenhagen',
        'Ostseeküste bei Rosenhagen',
        'location',
      ),
    ],
  },
};

export function getPropertyMedia(slug) {
  return propertyMedia[slug] ?? {
    hero: image('/assets/rosenhagen-beach.webp', 'Ostseeküste bei Rosenhagen', 'Lagebild', 'location'),
    gallery: [],
  };
}
