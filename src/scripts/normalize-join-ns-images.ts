/**
 * Renames every image in /public/join-ns to ns-pic-1..N.jpg (sorted by current
 * filename, which for the screenshots equals chronological order), and also
 * generates an ns-pic-N-thumb.jpg at 600px width for faster gallery loads.
 *
 * Run with: npx tsx src/scripts/normalize-join-ns-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "join-ns");
const THUMB_WIDTH = 600;
const FULL_MAX_WIDTH = 1800;

async function main() {
  const all = fs.readdirSync(DIR);
  const sources = all
    .filter((f) => /\.(png|jpe?g|webp|heic|gif)$/i.test(f))
    .filter((f) => !f.startsWith("ns-pic-"))
    .sort();

  if (sources.length === 0) {
    console.log("No new images to normalize.");
    return;
  }

  console.log(`Normalizing ${sources.length} image(s)...`);

  // Find the highest existing ns-pic-N index so we can append rather than overwrite.
  const existing = all
    .map((f) => f.match(/^ns-pic-(\d+)\.jpg$/))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => parseInt(m[1], 10));
  const startIndex = existing.length > 0 ? Math.max(...existing) + 1 : 1;

  for (let i = 0; i < sources.length; i++) {
    const src = path.join(DIR, sources[i]);
    const idx = startIndex + i;
    const fullOut = path.join(DIR, `ns-pic-${idx}.jpg`);
    const thumbOut = path.join(DIR, `ns-pic-${idx}-thumb.jpg`);

    const pipeline = sharp(src).rotate(); // honor EXIF orientation
    const meta = await pipeline.metadata();
    const width = meta.width ?? FULL_MAX_WIDTH;
    const targetWidth = Math.min(width, FULL_MAX_WIDTH);

    await sharp(src)
      .rotate()
      .resize({ width: targetWidth, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true })
      .toFile(fullOut);

    await sharp(src)
      .rotate()
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(thumbOut);

    fs.unlinkSync(src);
    console.log(`  ${sources[i]} → ns-pic-${idx}.jpg (+ thumb)`);
  }

  // Print final manifest count.
  const finalCount = fs
    .readdirSync(DIR)
    .filter((f) => /^ns-pic-\d+\.jpg$/.test(f)).length;
  console.log(`\nDone. ${finalCount} images in /public/join-ns/.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
