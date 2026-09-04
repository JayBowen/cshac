# cshac AWS infrastructure (Terraform)

Reproduces the AWS side of the cshac deploy pipeline: the `cshac-app` app bucket and its CloudFront distribution, the `cshac-gallery` photo bucket and its distribution, the GitHub Actions OIDC deploy role, and the gallery's cache/origin-request/CORS policies.

This is meant for standing everything up fresh in a **different AWS account** — not for importing the current live resources into Terraform state as-is. See `main.tf`'s header comment for exactly which parts are verified against the live console vs. still a reasonable reconstruction.

## Prerequisites

- Terraform >= 1.3
- AWS credentials for the **target** account, with permission to create IAM roles/policies, S3 buckets, and CloudFront distributions/policies (an admin-equivalent role is simplest for a one-time setup like this)

## Usage

```
cd infra/terraform
terraform init
terraform plan
terraform apply
```

## Before applying: bucket names

S3 bucket names are globally unique across *all* of AWS, not just your account. If the old account's `cshac-app`/`cshac-gallery` buckets still exist, pick different names first — either edit the defaults in `variables.tf`, or override without editing tracked files:

```
terraform apply -var="app_bucket_name=my-new-name" -var="gallery_bucket_name=my-other-new-name"
```

(`terraform.tfvars` also works and is already gitignored, if you'd rather set overrides once instead of passing `-var` every time.)

## After applying: wire the new resources back into the app

`terraform apply` prints outputs with everything you need. Update:

- **`.github/workflows/deployToS3.yml`** — `role-to-assume` (→ `github_actions_role_arn`), `S3_BUCKET` (→ `app_bucket_name`), `CLOUDFRONT_DISTRIBUTION_ID` (→ `app_cloudfront_distribution_id`)
- **GitHub repo variable `GALLERY_BASE_URL`** and your local **`.env.local`**'s `VITE_GALLERY_BASE_URL` (→ `gallery_cloudfront_domain`)

Re-run outputs any time with `terraform output`.

## Tearing down

`terraform destroy` will fail on non-empty S3 buckets (neither bucket resource sets `force_destroy`, on purpose — that's a safety rail against accidentally nuking real photos or a live app bundle). Empty a bucket first if you actually mean to destroy it:

```
aws s3 rm s3://<bucket-name> --recursive
```

## Notes

- State is local (the default `terraform.tfstate` in this directory, gitignored). No remote backend is configured — fine for solo use, worth revisiting if anyone else ever needs to run this.
- `.terraform.lock.hcl` **is** committed on purpose (Terraform's own recommendation) — it pins the exact provider version so `terraform init` behaves the same for anyone running this later.
