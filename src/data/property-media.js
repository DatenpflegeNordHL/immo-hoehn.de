const legacyCdn = 'https://primary.jwwb.nl/public/m/j/i/temp-gokzzpyuwghsepdshzbs';

const image = (src, alt, caption, kind = 'object') => ({ src, alt, caption, kind });

export const propertyMedia = {
  'einfamilienhaus-poetenitz-1724': {
    hero: image(
      '/assets/hero-coast-960.webp',
      'Ostseeküste bei Pötenitz',
      'Lagebild Pötenitz',
      'location',
    ),
    gallery: [],
    note: 'Die frühere Höhn-Objektseite enthält Bildbereiche zum Einfamilienhaus. Nach der Umschaltung der Domain lassen sich die ursprünglichen Objektdateien derzeit jedoch nicht belastbar aus dem alten Webador-Medienbestand zuordnen. Deshalb wird hier bewusst kein fremdes oder nur ähnliches Haus als Objektfoto ausgegeben.',
  },

  'eigentumswohnung-poetenitz-1722': {
    hero: image(
      `${legacyCdn}/poetenitz-25-05-06-03-high.jpg`,
      'Bestandsaufnahme zur Eigentumswohnung in Pötenitz, Objekt 1722',
      'Bestandsbild Objekt 1722',
    ),
    gallery: [
      image(`${legacyCdn}/poetenitz-25-05-06-03-high.jpg`, 'Bestandsaufnahme zur Eigentumswohnung in Pötenitz, Objekt 1722', 'Bestandsbild 1'),
      image(`${legacyCdn}/25-1722-10-strand-blick-travemuende-high-1rixbc.jpg`, 'Blick Richtung Travemünde aus dem Bildbestand zu Objekt 1722', 'Lage und Ausblick', 'location'),
      image(`${legacyCdn}/poetenitz-25-05-06-01-high-zy0ovt.jpg`, 'Bestandsaufnahme aus Pötenitz zu Objekt 1722', 'Bestandsbild 2'),
      image(`${legacyCdn}/poetenitz-25-05-06-04-high-2zxlwh.jpg`, 'Bestandsaufnahme aus Pötenitz zu Objekt 1722', 'Bestandsbild 3'),
      image(`${legacyCdn}/img_3045-high.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 4'),
      image(`${legacyCdn}/img_3046-high.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 5'),
      image(`${legacyCdn}/img_3047-high.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 6'),
      image(`${legacyCdn}/img_3048-high.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 7'),
      image(`${legacyCdn}/img_3055-high-jftlcr.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 8'),
      image(`${legacyCdn}/img_3056-high-w85d7v.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 9'),
      image(`${legacyCdn}/img_3057-high-6hom0s.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 10'),
      image(`${legacyCdn}/img_3058-high-2flrfy.jpg`, 'Innen- oder Objektaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 11'),
      image(`${legacyCdn}/img_3051-high-qabrkp.jpg`, 'Bestandsaufnahme aus dem veröffentlichten Bildbestand zu Objekt 1722', 'Objektansicht 12'),
      image(`${legacyCdn}/25-1722-10-ruckseite-high-jxpc8q.jpg`, 'Rückseite des Gebäudes zu Objekt 1722', 'Rückseite'),
      image(`${legacyCdn}/25-1722-10-terrasse-high-8pb0rz.jpg`, 'Terrassenbereich zu Objekt 1722', 'Terrasse'),
      image(`${legacyCdn}/25-1722-10-garten-high-fnemin.jpg`, 'Gartenbereich zu Objekt 1722', 'Garten'),
    ],
    note: 'Die Bilder stammen aus den Bildbereichen der früheren öffentlich erreichbaren Höhn-Objektseite für Objektnummer 1722.',
  },

  'baugrundstuecke-rosenhagen': {
    hero: image(
      `${legacyCdn}/luftbild-annimation-rosenhagen-kopie-high-23aj4x.jpg?crop=1.8605%3A1&enable=upscale&enable-io=true&width=1200`,
      'Luftbild zur Lage der Baugrundstücke in Rosenhagen',
      'Luftbild Rosenhagen',
      'project',
    ),
    gallery: [
      image(`${legacyCdn}/luftbild-annimation-rosenhagen-kopie-high-23aj4x.jpg?crop=1.8605%3A1&enable=upscale&enable-io=true&width=1200`, 'Luftbild zur Lage der Baugrundstücke in Rosenhagen', 'Luftbild und Projektlage', 'project'),
      image(`${legacyCdn}/image-high-uvurh4.png?crop=2.2044%3A1&enable=upscale&enable-io=true&width=1200`, 'Projektgrafik aus dem veröffentlichten Höhn-Bestand für Rosenhagen', 'Projektübersicht', 'project'),
      image(`${legacyCdn}/20201004_160949-high-o6i7pg.jpg`, 'Lageaufnahme aus Rosenhagen nahe der Ostseeküste', 'Lagebild Rosenhagen 1', 'location'),
      image(`${legacyCdn}/rosenhagen-25-04-16-high-fgwm0b.jpg`, 'Lageaufnahme aus Rosenhagen', 'Lagebild Rosenhagen 2', 'location'),
      image(`${legacyCdn}/rosenhagen-blick-vom-grundst-ck-2-high-dv4odn.jpg`, 'Blick aus dem Bereich der Grundstücke in Rosenhagen', 'Blick vom Grundstücksbereich', 'project'),
      image(`${legacyCdn}/img-20250429-wa0006-2-high-0smyjy.jpg`, 'Umgebungsaufnahme aus dem veröffentlichten Rosenhagen-Bildbestand', 'Lagebild Rosenhagen 3', 'location'),
    ],
    note: 'Diese sechs Bilder beziehungsweise Projektgrafiken wurden auf der früheren öffentlichen Höhn-Seite zum Rosenhagen-Projekt geführt.',
  },

  'baugrundstuecke-rosenhagen-von-privat': {
    hero: image(
      '/assets/rosenhagen-beach.webp',
      'Naturstrand bei Rosenhagen an der Ostsee',
      'Lagebild Rosenhagen',
      'location',
    ),
    gallery: [
      image(`${legacyCdn}/20201004_160949-high-o6i7pg.jpg`, 'Lageaufnahme aus Rosenhagen nahe der Ostseeküste', 'Umfeld Rosenhagen 1', 'location'),
      image(`${legacyCdn}/rosenhagen-25-04-16-high-fgwm0b.jpg`, 'Lageaufnahme aus Rosenhagen', 'Umfeld Rosenhagen 2', 'location'),
      image(`${legacyCdn}/img-20250429-wa0006-2-high-0smyjy.jpg`, 'Umgebungsaufnahme aus dem veröffentlichten Rosenhagen-Bildbestand', 'Umfeld Rosenhagen 3', 'location'),
    ],
    note: 'Auf der früheren Seite des privaten Grundstücksangebots war keine eindeutig zuordenbare Objektgalerie auslesbar. Deshalb werden ausschließlich als solche gekennzeichnete Lagebilder aus dem veröffentlichten Rosenhagen-Bestand gezeigt; sie sind keine Zusage, dass darauf die beiden privaten Parzellen zu sehen sind.',
  },
};

export function getPropertyMedia(slug) {
  return propertyMedia[slug] ?? {
    hero: image('/assets/hero-coast-960.webp', 'Ostseeküste', 'Lagebild', 'location'),
    gallery: [],
    note: '',
  };
}
