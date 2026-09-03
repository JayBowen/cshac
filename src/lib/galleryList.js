import { galleryAsset } from "@/lib/galleryAsset"

// Lists the gallery bucket directly via S3's ListObjectsV2 REST API (through
// CloudFront), instead of maintaining a manifest file — uploading new photos
// to S3 is the only step needed to update the live gallery. The tradeoff: no
// alt text and no known dimensions, since a bucket listing only carries keys
// and timestamps, never photo descriptions or pixel sizes.
const THUMB_KEY = /^(\d{4})\/thumbs\/(.+)$/

async function listPage(continuationToken) {
  const params = new URLSearchParams({ "list-type": "2" })
  if (continuationToken) params.set("continuation-token", continuationToken)

  const res = await fetch(galleryAsset(`?${params}`))
  if (!res.ok) throw new Error(`gallery list failed: ${res.status}`)

  const xml = new DOMParser().parseFromString(await res.text(), "application/xml")
  const objects = [...xml.getElementsByTagName("Contents")].map((c) => ({
    key: c.getElementsByTagName("Key")[0]?.textContent,
    lastModified: c.getElementsByTagName("LastModified")[0]?.textContent,
  }))

  const isTruncated = xml.getElementsByTagName("IsTruncated")[0]?.textContent === "true"
  const nextToken = isTruncated
    ? xml.getElementsByTagName("NextContinuationToken")[0]?.textContent
    : null

  return { objects, nextToken }
}

// 50 pages = 50,000 objects, far beyond any real gallery. If a page ever comes
// back with the same continuation token as before (e.g. a CDN caching bug
// serving a stale page regardless of the token requested), stop rather than
// loop forever hammering S3.
const MAX_PAGES = 50

export async function listGalleryImages() {
  const objects = []
  let token
  for (let pageCount = 0; pageCount === 0 || token; pageCount++) {
    if (pageCount >= MAX_PAGES) throw new Error("gallery list: too many pages, aborting")
    const page = await listPage(token)
    if (pageCount > 0 && page.nextToken === token) {
      throw new Error("gallery list: got the same page twice, aborting (possible CDN caching issue)")
    }
    objects.push(...page.objects)
    token = page.nextToken
  }

  return objects
    .map(({ key, lastModified }) => {
      const match = key.match(THUMB_KEY)
      if (!match) return null
      const [, year, name] = match
      return { year: Number(year), thumb: key, full: `${year}/full/${name}`, lastModified }
    })
    .filter(Boolean)
}
