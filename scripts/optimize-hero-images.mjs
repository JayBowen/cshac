#!/usr/bin/env node
// One-off tool: recompress the homepage hero images in place. Re-run this
// whenever any of the files below are replaced (e.g. when the licensed
// hero-mid.jpg replacement lands — see the TODO in src/components/Hero.jsx).
//
// Hero photos convert straight to AVIF, same reasoning as the gallery
// pipeline (scripts/process-gallery-images.mjs): browser support for
// <img src="*.avif"> is broad enough not to need a JPEG fallback. Quality is
// higher than the gallery's (58 vs 45-52) since each of these is a large,
// full-bleed, above-the-fold image rather than a grid thumbnail — more
// pixels are visible at once, so compression artifacts are more noticeable.
//
// crest.png stays PNG (sharp edges/flat colour logo, not a photo — AVIF's
// chroma subsampling tends to soften exactly that kind of art) but gets
// resized down from 512x512 to 128x128: it only ever renders at 64px
// (size-16 in Hero.jsx), so 128px is already a 2x allowance for retina
// displays and the rest was pure waste.
//
// Usage: node scripts/optimize-hero-images.mjs

import sharp from "sharp"
import { stat, rename } from "node:fs/promises"
import path from "node:path"

const PUBLIC_DIR = path.join(import.meta.dirname, "..", "public")
const HERO_QUALITY = 58

const heroPhotos = ["hero-group.jpg", "hero-mid.jpg", "hero-portrait.jpg"]

let totalBefore = 0
let totalAfter = 0

for (const file of heroPhotos) {
  const srcPath = path.join(PUBLIC_DIR, file)
  const outPath = path.join(PUBLIC_DIR, file.replace(/\.jpe?g$/i, ".avif"))

  const { size: beforeSize } = await stat(srcPath)
  const info = await sharp(srcPath).avif({ quality: HERO_QUALITY }).toFile(outPath)

  totalBefore += beforeSize
  totalAfter += info.size
  console.log(
    `${file}: ${(beforeSize / 1024).toFixed(0)}KB -> ${path.basename(outPath)} ${(info.size / 1024).toFixed(0)}KB ` +
      `(${info.width}x${info.height}, ${(100 * (1 - info.size / beforeSize)).toFixed(0)}% smaller)`
  )
}

const crestPath = path.join(PUBLIC_DIR, "crest.png")
const { size: crestBefore } = await stat(crestPath)
const crestBuffer = await sharp(crestPath).resize({ width: 128, height: 128 }).png().toBuffer()
await sharp(crestBuffer).toFile(crestPath + ".tmp")
await rename(crestPath + ".tmp", crestPath)
const { size: crestAfter } = await stat(crestPath)
totalBefore += crestBefore
totalAfter += crestAfter
console.log(
  `crest.png: ${(crestBefore / 1024).toFixed(0)}KB -> ${(crestAfter / 1024).toFixed(0)}KB ` +
    `(512x512 -> 128x128, ${(100 * (1 - crestAfter / crestBefore)).toFixed(0)}% smaller)`
)

console.log(
  `\nTotal: ${(totalBefore / 1024).toFixed(0)}KB -> ${(totalAfter / 1024).toFixed(0)}KB ` +
    `(${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}% smaller)`
)
console.log(`\nNow update src/components/Hero.jsx to reference the new .avif files, and delete the old .jpg files.`)
