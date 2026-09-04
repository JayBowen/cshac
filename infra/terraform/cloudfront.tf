# AWS managed policies — same ID in every account, so these resolve fine
# right after a fresh `terraform apply` in a brand new account.
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host_header" {
  name = "Managed-AllViewerExceptHostHeader"
}

# --- Origin Access Control: lets CloudFront read each private bucket ---

resource "aws_cloudfront_origin_access_control" "app" {
  name                              = "${var.app_bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_origin_access_control" "gallery" {
  name                              = "${var.gallery_bucket_name}-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# --- Gallery-specific policies ---
# The app doesn't have a manifest file — Gallery.jsx lists the bucket
# directly via S3's ListObjectsV2 REST API (src/lib/galleryList.js). That
# request needs its query string (list-type, continuation-token) to actually
# reach S3, and its response needs CORS headers so a browser fetch() can read
# it. Both were debugged at length during setup:
#   - Without the cache policy varying by these query strings, CloudFront
#     served the same cached "page 1" forever regardless of the
#     continuation-token requested — an infinite-pagination bug.
#   - Without an origin request policy forwarding those same query strings
#     to the origin, S3 silently ignored list-type=2 and returned the older
#     ListObjectsV1 shape instead (no KeyCount/NextContinuationToken).
#   - Without CORS, the browser blocked reading the response entirely.

resource "aws_cloudfront_cache_policy" "gallery_list_short_ttl" {
  name    = "gallery-list-short-ttl"
  comment = "Short TTL for the S3 list request at the gallery bucket root, so new uploads show up quickly without a manifest or invalidation step."

  min_ttl     = 0
  default_ttl = 30
  max_ttl     = 60

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "whitelist"
      query_strings {
        items = ["list-type", "continuation-token"]
      }
    }
  }
}

resource "aws_cloudfront_response_headers_policy" "gallery_cors" {
  name    = "gallery-cors"
  comment = "CORS for the gallery bucket's S3 list endpoint, fetched client-side by the app."

  cors_config {
    access_control_allow_credentials = false
    origin_override                  = true

    access_control_allow_headers {
      items = ["*"]
    }
    access_control_allow_methods {
      items = ["GET"]
    }
    access_control_allow_origins {
      items = ["*"]
    }
  }
}

# --- App distribution (cshac-app) ---
# Reconstructed to match what the deployed React Router app needs (SPA
# fallback to index.html); this distribution pre-dates this Terraform and its
# exact live settings were never inspected directly — verify before relying
# on this for a real prod cutover.

resource "aws_cloudfront_distribution" "app" {
  enabled             = true
  comment             = "cshac React app"
  default_root_object = "index.html"
  # "Use all edge locations (best performance)" on the live distribution —
  # this also happens to be the provider's own default when unset, but set
  # explicitly now that it's confirmed rather than relying on that silently.
  price_class = "PriceClass_All"

  origin {
    domain_name              = aws_s3_bucket.app.bucket_regional_domain_name
    origin_id                = "app-s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.app.id
  }

  default_cache_behavior {
    target_origin_id       = "app-s3"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
    compress               = true
  }

  # React Router client-side routes 404 at the origin (there's no matching
  # S3 key) — rewrite to index.html so the SPA's own router can take over.
  # Verified against the live distribution's Error pages tab.
  custom_error_response {
    error_code            = 403
    error_caching_min_ttl = 10
    response_code         = 200
    response_page_path    = "/index.html"
  }
  custom_error_response {
    error_code            = 404
    error_caching_min_ttl = 10
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# --- Gallery distribution (cshac-gallery) ---

resource "aws_cloudfront_distribution" "gallery" {
  enabled     = true
  comment     = "cshac gallery photos"
  price_class = "PriceClass_All"

  origin {
    domain_name              = aws_s3_bucket.gallery.bucket_regional_domain_name
    origin_id                = "gallery-s3"
    origin_access_control_id = aws_cloudfront_origin_access_control.gallery.id
  }

  # Photos: long-cache as normal, no special policies needed — <img> loads
  # don't need CORS or query-string forwarding.
  default_cache_behavior {
    target_origin_id       = "gallery-s3"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    cache_policy_id        = data.aws_cloudfront_cache_policy.caching_optimized.id
    compress               = true
  }

  # Bucket-root S3 list request (exact path "/", distinct from image paths
  # like /2026/thumbs/x.jpg) — needs its own short-TTL cache policy, query
  # string forwarding, and CORS. Precedence 0 so it's checked before the
  # catch-all default behavior.
  ordered_cache_behavior {
    path_pattern               = "/"
    target_origin_id           = "gallery-s3"
    viewer_protocol_policy     = "redirect-to-https"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    cache_policy_id            = aws_cloudfront_cache_policy.gallery_list_short_ttl.id
    origin_request_policy_id   = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.gallery_cors.id
    compress                   = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
