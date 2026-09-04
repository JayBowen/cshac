# These map directly onto the places the current values are hardcoded/set
# outside Terraform — update those after a fresh apply in a new account:
#   - .github/workflows/deployToS3.yml: role-to-assume, S3_BUCKET,
#     CLOUDFRONT_DISTRIBUTION_ID
#   - GitHub repo variable GALLERY_BASE_URL and local .env.local
#     (VITE_GALLERY_BASE_URL): gallery_cloudfront_domain, below

output "aws_account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "github_actions_role_arn" {
  value = aws_iam_role.github_actions_deploy.arn
}

output "app_bucket_name" {
  value = aws_s3_bucket.app.bucket
}

output "app_cloudfront_domain" {
  value = aws_cloudfront_distribution.app.domain_name
}

output "app_cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.app.id
}

output "gallery_bucket_name" {
  value = aws_s3_bucket.gallery.bucket
}

output "gallery_cloudfront_domain" {
  value = "https://${aws_cloudfront_distribution.gallery.domain_name}"
}

output "gallery_cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.gallery.id
}
