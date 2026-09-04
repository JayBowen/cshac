#!/usr/bin/env node
// One-off tool: resize + recompress raw gallery photos into a thumb and a
// full-size AVIF variant, ready to upload straight to S3. The live gallery
// lists the bucket directly at runtime (see src/lib/galleryList.js) — no
// manifest to keep in sync, just get the files into the right folders and
// upload.
//
// AVIF quality settings below were picked by measuring against the actual
// gallery's real photos (1861 thumbs, 1861 full): ~46% smaller than the
// equivalent mozjpeg output with zero regressions on thumbs, ~44% smaller
// with zero regressions on a 300-file sample of full. Browser support for
// <img src="*.avif"> is broad enough at this point not to need a fallback;
// if that ever changes, a <picture> with a JPEG/WebP fallback source is the
// place to add it — deliberately not building that ahead of actually needing it.
//
// Each file's year is taken from a date embedded in its own filename (e.g.
// "IMG-20230819-WA0041.jpg" -> 2023), so a single run can span multiple
// years. Files with no recognizable date fall back to <year>.
//
// Usage:
//   node scripts/process-gallery-images.mjs <sourceDir> <fallbackYear> [outDir]
//
// Reads every jpg/jpeg/png/webp in <sourceDir> and writes:
//   <outDir>/<year>/thumbs/<name>.avif   (grid tile size)
//   <outDir>/<year>/full/<name>.avif     (lightbox / full-view size)
//
// Then upload with e.g.:
//   aws s3 sync <outDir> s3://cshac-gallery
// (or drag each year folder into the bucket via the S3 console)

import sharp from "sharp"
import { readdir, mkdir, stat } from "node:fs/promises"
import path from "node:path"

const THUMB_WIDTH = 700
const THUMB_QUALITY = 45
const FULL_WIDTH = 2200
const FULL_QUALITY = 52

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])
const CURRENT_YEAR = new Date().getFullYear()

// Tried in order of confidence against the real gallery filenames (checked
// against all 1861 real thumbs before adding each pattern, to catch false
// positives before they'd silently misfile a photo):
//
// 1. An 8-digit YYYYMMDD (optionally dash/underscore-separated) anywhere in
//    the name, e.g. "IMG-20230819-WA0041" or "photo_2023-08-19_party" -> 2023.
//    Validates the month/day/year ranges so it doesn't mistake an arbitrary
//    long numeric ID (Facebook/Canva export names are full of these) for a date.
// 2. A day + month name + year, e.g. "31st-dec-2023-james" -> 2023.
// 3. A bare year bounded by hyphens/underscores/string edges, e.g.
//    "achill-2023-paul" -> 2023. Deliberately requires that boundary rather
//    than just "not adjacent to another digit" — hex-hash filenames (Facebook/
//    CDN exports) are full of 4-digit runs that coincidentally fall in a
//    plausible year range, but never sit next to a hyphen the way a real
//    human-written date does; "1992f9b227d35434..." matches an unbounded bare
//    year at "1992" (wrong), but not this stricter version.
const DATE_PATTERNS = [
  /(\d{4})[-_]?(\d{2})[-_]?(\d{2})/g,
  /\d{1,2}(?:st|nd|rd|th)?[-_ ]?(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[-_ ]?(\d{4})/gi,
  /(?:^|[-_])(\d{4})(?:[-_]|$)/g,
]

function detectYearFromFilename(name) {
  for (const pattern of DATE_PATTERNS) {
    for (const match of name.matchAll(pattern)) {
      const [, y, m, d] = match
      const year = Number(y)
      if (year < 1990 || year > CURRENT_YEAR) continue
      if (m !== undefined) {
        const month = Number(m)
        const day = Number(d)
        if (month < 1 || month > 12) continue
        if (day < 1 || day > 31) continue
      }
      return year
    }
  }
  return null
}

const [sourceDir, fallbackYear, outDir = "gallery-processed"] = process.argv.slice(2)

if (!sourceDir || !fallbackYear) {
  console.error("Usage: node scripts/process-gallery-images.mjs <sourceDir> <fallbackYear> [outDir]")
  process.exit(1)
}

const files = (await readdir(sourceDir)).filter((f) =>
  IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase())
)

if (files.length === 0) {
  console.error(`No images found in ${sourceDir}`)
  process.exit(1)
}

const madeDirs = new Set()
async function dirsForYear(year) {
  const yearDir = path.join(outDir, String(year))
  const thumbsDir = path.join(yearDir, "thumbs")
  const fullDir = path.join(yearDir, "full")
  if (!madeDirs.has(year)) {
    await mkdir(thumbsDir, { recursive: true })
    await mkdir(fullDir, { recursive: true })
    madeDirs.add(year)
  }
  return { thumbsDir, fullDir }
}

let totalBefore = 0
let totalAfter = 0
const countsByYear = new Map()

for (const file of files) {
  const name = path.parse(file).name
  const detectedYear = detectYearFromFilename(name)
  const year = detectedYear ?? Number(fallbackYear)
  const { thumbsDir, fullDir } = await dirsForYear(year)

  const srcPath = path.join(sourceDir, file)
  const { size: originalSize } = await stat(srcPath)
  const srcBuffer = await sharp(srcPath).rotate().toBuffer() // rotate() bakes in EXIF orientation

  const thumbPath = path.join(thumbsDir, `${name}.avif`)
  await sharp(srcBuffer)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .avif({ quality: THUMB_QUALITY })
    .toFile(thumbPath)

  const fullPath = path.join(fullDir, `${name}.avif`)
  const fullInfo = await sharp(srcBuffer)
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .avif({ quality: FULL_QUALITY })
    .toFile(fullPath)

  const { size: thumbSize } = await stat(thumbPath)
  totalBefore += originalSize
  totalAfter += thumbSize + fullInfo.size
  countsByYear.set(year, (countsByYear.get(year) ?? 0) + 1)

  console.log(
    `${file}: ${(originalSize / 1024).toFixed(0)}KB -> ` +
      `thumb ${(thumbSize / 1024).toFixed(0)}KB, full ${(fullInfo.size / 1024).toFixed(0)}KB ` +
      `(${fullInfo.width}x${fullInfo.height}) -> ${year}${detectedYear ? "" : " (fallback)"}`
  )
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`)

console.log(`\nBy year:`)
for (const [year, count] of [...countsByYear].sort()) {
  console.log(`  ${year}: ${count} photo${count === 1 ? "" : "s"}`)
}

console.log(`\nUpload:`)
console.log(`  aws s3 sync ${outDir} s3://cshac-gallery`)
