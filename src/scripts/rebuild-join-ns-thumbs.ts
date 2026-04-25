/**
 * Regenerates square-cropped thumbnails for every ns-pic-N.jpg in
 * /public/join-ns. Output: ns-pic-N-thumb.jpg at 400x400 (cover-crop),
 * JPEG q70 — typically ~15 KB each. The full ns-pic-N.jpg is left
 * untouched and remains the source for the lightbox.
 *
 * Run: npx tsx src/scripts/rebuild-join-ns-thumbs.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "join-ns");
const THUMB_SIZE = 400;
const QUALITY = 70;

async function main() {
  const fulls = fs
    .readdirSync(DIR)
    .filter((f) => /^ns-pic-\d+\.jpg$/.test(f))
    .sort((a, b) => {
      const ai = parseInt(a.match(/(\d+)/)![1], 10);
      const bi = parseInt(b.match(/(\d+)/)![1], 10);
      return ai - bi;
    });

  console.log(`Rebuilding ${fulls.length} thumbnails at ${THUMB_SIZE}x${THUMB_SIZE}...`);

  let totalBytes = 0;
  for (const file of fulls) {
    const idx = file.match(/(\d+)/)![1];
    const src = path.join(DIR, file);
    const out = path.join(DIR, `ns-pic-${idx}-thumb.jpg`);
    await sharp(src)
      .rotate()
      .resize({ width: THUMB_SIZE, height: THUMB_SIZE, fit: "cover", position: "attention" })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out);
    totalBytes += fs.statSync(out).size;
  }

  console.log(`Done. Avg thumb size: ${Math.round(totalBytes / fulls.length / 1024)} KB`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
