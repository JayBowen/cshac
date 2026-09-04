variable "aws_region" {
  description = <<-EOT
    Both buckets were observed at us-east-2 during setup (via their
    bucket.s3.us-east-2.amazonaws.com endpoints), despite the GitHub Actions
    workflow's AWS_REGION variable saying eu-west-1 — that mismatch was
    flagged but never reconciled. us-east-2 is what's actually live.
  EOT
  type        = string
  default     = "us-east-2"
}

variable "app_bucket_name" {
  description = "S3 bucket serving the built React app (synced from dist/ on deploy)."
  type        = string
  default     = "cshac-app"
}

variable "gallery_bucket_name" {
  description = "S3 bucket holding gallery photos ({year}/thumbs/*, {year}/full/*), listed directly by the app at runtime — see src/lib/galleryList.js."
  type        = string
  default     = "cshac-gallery"
}

variable "github_owner_login" {
  description = "Current GitHub account login. Appears in the OIDC sub claim alongside the immutable ID below — GitHub's newer sub format is \"login@id\", not just the login."
  type        = string
  default     = "JayBowen"
}

variable "github_owner_id" {
  description = "Immutable numeric GitHub account ID. Survives username changes; a trust policy written against the login alone would silently stop matching if the account is ever renamed."
  type        = string
  default     = "6490940"
}

variable "github_repo_name" {
  type    = string
  default = "cshac"
}

variable "github_repo_id" {
  description = "Immutable numeric GitHub repo ID (survives repo renames)."
  type        = string
  default     = "1353393299"
}

variable "github_deploy_branch" {
  description = "Branch the S3 deploy workflow runs on. The OIDC trust policy only allows role assumption from this exact branch."
  type        = string
  default     = "main"
}

variable "github_actions_role_name" {
  type    = string
  default = "github-actions-react-deploy"
}
