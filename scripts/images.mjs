#!/usr/bin/env node
/**
 * Photograph pipeline — `npm run images`.
 *
 * The client shoots on a DSLR and sends 6–9 MB PNG/JPEGs. Those must never reach
 * the repository: they carry EXIF (his camera writes GPS), they are 4000–6000px
 * on the long edge, and git stores every revision of a binary forever. This
 * script is the gate between his Drive folder and `public/images/`.
 *
 * Usage
 *   1. drop the originals into `photos-source/` (gitignored)
 *   2. npm run images
 *   3. paste the printed manifest entries into src/config/images.ts and write
 *      real Dutch alt text for each
 *
 * What it does to every file:
 *   - resizes so the long edge is at most MAX_EDGE (2400px), never upscaling
 *   - re-encodes to WebP, stepping quality down until it is under MAX_BYTES
 *   - strips ALL metadata — EXIF, GPS, colour profile beyond sRGB, the lot
 *   - prints width/height and a ~100-byte LQIP for the manifest
 *
 * ── Why WebP only, and not a second AVIF copy ────────────────────────────────
 * The brief asks for "AVIF + WebP". Those are DELIVERY formats, and they are
 * already handled: next.config.ts sets `images.formats = ['image/avif',
 * 'image/webp']`, so next/image negotiates per request and serves AVIF to every
 * browser that accepts it, WebP to the rest. What this script produces is the
 * MASTER that next/image re-encodes from.
 *
 * Committing an AVIF sibling as well would double the repository's binary weight
 * to produce bytes no visitor ever receives — the master is read at build time
 * and never served. WebP is the right master: it decodes everywhere sharp runs,
 * and re-encoding AVIF→AVIF would compound generation loss.
 *
 * If you ever drop next/image, this decision is the thing to revisit.
 */

import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = 'photos-source';
const OUTPUT_DIR = path.join('public', 'images');

/** Long edge cap. Beyond this next/image is downscaling on every build anyway. */
const MAX_EDGE = 2400;
/** Per-file ceiling. Hit by stepping quality down, never by cropping. */
const MAX_BYTES = 300 * 1024;
/** Quality ladder. Stops at the first rung that fits under MAX_BYTES. */
const QUALITY_STEPS = [82, 76, 70, 64, 58];
/** LQIP edge. 12px is ~100 bytes and still resolves the photograph's colours. */
const LQIP_EDGE = 12;

const INPUT_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff', '.avif']);

/** `KC4A9373.JPG` → `kc4a9373`. Keeps filenames URL-safe and predictable. */
function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatBytes(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

/**
 * Encode at the highest quality on the ladder that lands under MAX_BYTES.
 * Returns the last rung's buffer if none do, rather than failing — a slightly
 * oversized photograph is a better outcome than a missing one, and the log line
 * says so.
 */
async function encodeUnderBudget(pipeline) {
  let last = null;

  for (const quality of QUALITY_STEPS) {
    const buffer = await pipeline.clone().webp({ quality, effort: 6 }).toBuffer();
    last = { buffer, quality };
    if (buffer.byteLength <= MAX_BYTES) return { ...last, withinBudget: true };
  }

  return { ...last, withinBudget: false };
}

async function main() {
  if (!existsSync(SOURCE_DIR)) {
    console.error(
      `\nNo ${SOURCE_DIR}/ directory found.\n\n` +
        `Create it and drop the client's original photographs in, then re-run:\n` +
        `  mkdir ${SOURCE_DIR} && npm run images\n\n` +
        `It is gitignored on purpose — originals must not be committed.\n`,
    );
    process.exitCode = 1;
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });

  const entries = (await readdir(SOURCE_DIR))
    .filter((name) => INPUT_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort();

  if (entries.length === 0) {
    console.log(`\nNothing to do — ${SOURCE_DIR}/ holds no images.\n`);
    return;
  }

  console.log(`\nProcessing ${entries.length} photograph(s) from ${SOURCE_DIR}/\n`);

  const manifest = [];

  for (const entry of entries) {
    const sourcePath = path.join(SOURCE_DIR, entry);
    const sourceBytes = (await stat(sourcePath)).size;
    const slug = slugify(entry);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.webp`);

    // `failOn: 'none'` so a slightly malformed export from a phone or a photo
    // app still processes instead of aborting the whole batch.
    const input = sharp(sourcePath, { failOn: 'none' }).rotate();
    const metadata = await input.metadata();

    const longEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);
    const resized = input
      .resize({
        width: metadata.width >= metadata.height ? Math.min(metadata.width, MAX_EDGE) : undefined,
        height: metadata.height > metadata.width ? Math.min(metadata.height, MAX_EDGE) : undefined,
        // Never enlarge: an upscaled 900px original is a soft 2400px file.
        withoutEnlargement: true,
      })
      // sRGB explicitly. A camera-profile file (AdobeRGB, Display P3) renders
      // visibly desaturated in browsers that ignore the embedded profile.
      .toColorspace('srgb');

    const { buffer, quality, withinBudget } = await encodeUnderBudget(resized);
    await writeFile(outputPath, buffer);

    // Read back rather than trusting the requested size — `withoutEnlargement`
    // and orientation both change the result.
    const { width, height } = await sharp(buffer).metadata();

    const lqip = await sharp(buffer)
      .resize(LQIP_EDGE, LQIP_EDGE, { fit: 'inside' })
      .webp({ quality: 55 })
      .toBuffer();

    manifest.push({
      slug,
      src: `/images/${slug}.webp`,
      width,
      height,
      blurDataURL: `data:image/webp;base64,${lqip.toString('base64')}`,
    });

    const budgetNote = withinBudget ? '' : `  ⚠ over ${formatBytes(MAX_BYTES)} budget`;
    console.log(
      `  ${entry}\n` +
        `    → ${outputPath}\n` +
        `      ${longEdge}px → ${width}×${height} · ` +
        `${formatBytes(sourceBytes)} → ${formatBytes(buffer.byteLength)} · q${quality}` +
        `${budgetNote}`,
    );
  }

  console.log(
    `\n${'─'.repeat(76)}\n` +
      `Manifest entries for src/config/images.ts.\n` +
      `Replace each TODO alt with real Dutch alt text — it is both accessibility\n` +
      `and image-search traffic, and a generic one earns neither.\n` +
      `${'─'.repeat(76)}\n`,
  );

  for (const item of manifest) {
    console.log(
      `  ${item.slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}: {\n` +
        `    src: '${item.src}',\n` +
        `    width: ${item.width},\n` +
        `    height: ${item.height},\n` +
        `    alt: 'TODO — beschrijf wat er te zien is, in het Nederlands.',\n` +
        `    blurDataURL:\n      '${item.blurDataURL}',\n` +
        `  },`,
    );
  }

  console.log('');
}

await main();
