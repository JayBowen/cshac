# --- App bucket (cshac-app): serves the built React app ---

resource "aws_s3_bucket" "app" {
  bucket = var.app_bucket_name
}

resource "aws_s3_bucket_public_access_block" "app" {
  bucket = aws_s3_bucket.app.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ACLs disabled, ownership fully with this account — confirmed via the live
# bucket's Permissions tab (Object Ownership: "Bucket owner enforced"). This
# is also the AWS default for any bucket created after April 2023, but set
# explicitly here rather than relying on an implicit default.
resource "aws_s3_bucket_ownership_controls" "app" {
  bucket = aws_s3_bucket.app.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

# Matches the live bucket policy exactly (Sid, Id, Version 2008-10-17, and
# ArnLike rather than StringEquals) — confirmed via the console's Permissions
# tab. This predates the gallery bucket's policy, which was authored fresh
# during this project using StringEquals instead; both are valid, they're
# just two different policies with the same intent.
data "aws_iam_policy_document" "app_bucket_policy" {
  policy_id = "PolicyForCloudFrontPrivateContent"
  version   = "2008-10-17"

  statement {
    sid       = "AllowCloudFrontServicePrincipal"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.app.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "ArnLike"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.app.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "app" {
  bucket = aws_s3_bucket.app.id
  policy = data.aws_iam_policy_document.app_bucket_policy.json
}

# --- Gallery bucket (cshac-gallery): {year}/thumbs/*, {year}/full/* ---
# Policy verified end-to-end during setup — see the ListBucket/GetObject
# debugging in project history (this is the exact shape that worked).

resource "aws_s3_bucket" "gallery" {
  bucket = var.gallery_bucket_name
}

# Confirmed via the live bucket's Permissions tab (Object Ownership: "Bucket
# owner enforced").
resource "aws_s3_bucket_ownership_controls" "gallery" {
  bucket = aws_s3_bucket.gallery.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "gallery" {
  bucket = aws_s3_bucket.gallery.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Versioning was recommended when this bucket was set up (irreplaceable club
# photos) but was never actually turned on — confirmed against the live
# bucket's Properties tab ("Bucket Versioning: Disabled"). No
# aws_s3_bucket_versioning resource here on purpose: S3's real
# PutBucketVersioning API only accepts "Enabled" or "Suspended", never
# "Disabled" — that's just the console's label for "never configured". If
# you later want versioning, add the resource back with status = "Enabled".

data "aws_iam_policy_document" "gallery_bucket_policy" {
  policy_id = "PolicyForCloudFrontPrivateContent"
  version   = "2008-10-17"

  statement {
    sid       = "AllowCloudFrontGetObject"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.gallery.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.gallery.arn]
    }
  }

  # Needed for the app's S3 ListObjectsV2 call (galleryList.js) to work at
  # all — GetObject alone isn't enough. Bucket-level resource (no /*), unlike
  # the GetObject statement above.
  statement {
    sid       = "AllowCloudFrontListBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.gallery.arn]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.gallery.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "gallery" {
  bucket = aws_s3_bucket.gallery.id
  policy = data.aws_iam_policy_document.gallery_bucket_policy.json
}
