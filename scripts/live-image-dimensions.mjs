const BASE = 'https://immo-hoehn.de';
const assets = [
  '/assets/hero-coast-480.webp',
  '/assets/hero-coast-960.webp',
  '/assets/hero-coast-1440.webp',
  '/assets/region-map-480.webp',
  '/assets/region-map-960.webp',
  '/assets/compass-128.webp',
  '/assets/region-dune-grass-320.webp',
  '/assets/heritage-house-600.webp',
  '/assets/heritage-house.webp',
  '/assets/rosenhagen-beach.webp',
];

function u24(buf, offset) {
  return buf[offset] | (buf[offset + 1] << 8) | (buf[offset + 2] << 16);
}

function webpSize(buf) {
  const ascii = (start, end) => Buffer.from(buf.subarray(start, end)).toString('ascii');
  if (ascii(0, 4) !== 'RIFF' || ascii(8, 12) !== 'WEBP') throw new Error('not WebP');
  let offset = 12;
  while (offset + 8 <= buf.length) {
    const type = ascii(offset, offset + 4);
    const len = buf.readUInt32LE(offset + 4);
    const p = offset + 8;
    if (type === 'VP8X' && p + 10 <= buf.length) {
      return { width: 1 + u24(buf, p + 4), height: 1 + u24(buf, p + 7) };
    }
    if (type === 'VP8 ' && p + 10 <= buf.length) {
      if (buf[p + 3] === 0x9d && buf[p + 4] === 0x01 && buf[p + 5] === 0x2a) {
        return { width: buf.readUInt16LE(p + 6) & 0x3fff, height: buf.readUInt16LE(p + 8) & 0x3fff };
      }
    }
    if (type === 'VP8L' && p + 5 <= buf.length && buf[p] === 0x2f) {
      const b1 = buf[p + 1], b2 = buf[p + 2], b3 = buf[p + 3], b4 = buf[p + 4];
      return {
        width: 1 + b1 + ((b2 & 0x3f) << 8),
        height: 1 + ((b2 & 0xc0) >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
      };
    }
    offset = p + len + (len % 2);
  }
  throw new Error('dimensions not found');
}

for (const path of assets) {
  const response = await fetch(BASE + path, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    console.log(`${path} HTTP ${response.status}`);
    continue;
  }
  const buf = Buffer.from(await response.arrayBuffer());
  const { width, height } = webpSize(buf);
  console.log(`${path} ${width}x${height} bytes=${buf.length}`);
}
