# Reproduces the AWS side of the cshac deploy pipeline: two S3 buckets (app +
# gallery), two CloudFront distributions in front of them, the OIDC trust
# relationship GitHub Actions uses to deploy, and the gallery-specific
# CloudFront policies needed for its S3-listing endpoint (see
# src/lib/galleryList.js).
#
# Intended for standing this up fresh in a different AWS account, not for
# importing the current live resources into Terraform state as-is.
#
# Confidence notes:
#   Every resource here was checked against the live console during setup —
#   the IAM role's trust policy and permission policy ("ReactAppDeployment"),
#   both S3 bucket policies and public-access settings, the gallery bucket's
#   (lack of) versioning, both CloudFront distributions' origins/behaviors/
#   error pages, and the gallery-specific cache/origin-request/CORS policies.
#   Untouched AWS defaults (origin connection timeouts, Origin Shield,
#   Mutual TLS, etc.) are left unset here rather than pinned, since that's
#   how they're actually configured.

terraform {
  required_version = ">= 1.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}
