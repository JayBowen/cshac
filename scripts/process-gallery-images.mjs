#!/usr/bin/env node
// One-off tool: resize + recompress raw gallery photos into a thumb and a
// full-size variant, ready to upload straight to S3. The live gallery lists
// the bucket directly at runtime (see src/lib/galleryList.js) — no manifest
// to keep in sync, just get the files into the right folders and upload.
//
// Usage:
//   node scripts/process-gallery-images.mjs <sourceDir> <year> [outDir]
//
// Reads every jpg/jpeg/png/webp in <sourceDir> and writes:
//   <outDir>/<year>/thumbs/<name>.jpg   (grid tile size)
//   <outDir>/<year>/full/<name>.jpg     (lightbox / full-view size)
//
// Then upload with e.g.:
//   aws s3 sync <outDir>/<year> s3://cshac-gallery/<year>
// (or drag the thumbs/ and full/ folders into the bucket via the S3 console)

import sharp from "sharp"
import { readdir, mkdir, stat } from "node:fs/promises"
import path from "node:path"

const THUMB_WIDTH = 700
const THUMB_QUALITY = 70
const FULL_WIDTH = 2200
const FULL_QUALITY = 78

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

const [sourceDir, year, outDir = "gallery-processed"] = process.argv.slice(2)

if (!sourceDir || !year) {
  console.error("Usage: node scripts/process-gallery-images.mjs <sourceDir> <year> [outDir]")
  process.exit(1)
}

const yearDir = path.join(outDir, year)
const thumbsDir = path.join(yearDir, "thumbs")
const fullDir = path.join(yearDir, "full")
await mkdir(thumbsDir, { recursive: true })
await mkdir(fullDir, { recursive: true })

const files = (await readdir(sourceDir)).filter((f) =>
  IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase())
)

if (files.length === 0) {
  console.error(`No images found in ${sourceDir}`)
  process.exit(1)
}

let totalBefore = 0
let totalAfter = 0

for (const file of files) {
  const name = path.parse(file).name
  const srcPath = path.join(sourceDir, file)
  const { size: originalSize } = await stat(srcPath)
  const srcBuffer = await sharp(srcPath).rotate().toBuffer() // rotate() bakes in EXIF orientation

  const thumbPath = path.join(thumbsDir, `${name}.jpg`)
  await sharp(srcBuffer)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toFile(thumbPath)

  const fullPath = path.join(fullDir, `${name}.jpg`)
  const fullInfo = await sharp(srcBuffer)
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: FULL_QUALITY, mozjpeg: true })
    .toFile(fullPath)

  const { size: thumbSize } = await stat(thumbPath)
  totalBefore += originalSize
  totalAfter += thumbSize + fullInfo.size

  console.log(
    `${file}: ${(originalSize / 1024).toFixed(0)}KB -> ` +
      `thumb ${(thumbSize / 1024).toFixed(0)}KB, full ${(fullInfo.size / 1024).toFixed(0)}KB ` +
      `(${fullInfo.width}x${fullInfo.height})`
  )
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`)
console.log(`\nUpload:`)
console.log(`  aws s3 sync ${yearDir} s3://cshac-gallery/${year}`)
