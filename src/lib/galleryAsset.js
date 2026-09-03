// Gallery photos live in their own S3 bucket/CloudFront distro, separate from
// the app bundle, so they survive app deploys and aren't limited by dist/ size.
// VITE_GALLERY_BASE_URL is that distribution's origin (no trailing slash),
// e.g. https://xxxxxxxxxxxxxx.cloudfront.net
const GALLERY_BASE_URL = import.meta.env.VITE_GALLERY_BASE_URL ?? ""

export function galleryAsset(path) {
  return `${GALLERY_BASE_URL}/${String(path).replace(/^\/+/, "")}`
}
