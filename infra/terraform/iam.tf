# GitHub Actions OIDC → AWS role. This exact shape (immutable owner/repo IDs
# in the sub claim, ref:refs/heads/<branch> for a plain branch trigger) was
# reverse-engineered by decoding the actual OIDC token during setup — see the
# "repo:JayBowen@6490940/cshac@1353393299:ref:refs/heads/main" debugging in
# project history. Do not simplify this back to "repo:owner/name:ref:..." —
# that's the older format and silently fails AssumeRoleWithWebIdentity.

resource "aws_iam_openid_connect_provider" "github_actions" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]

  # AWS-published GitHub Actions OIDC thumbprint. AWS stopped strictly
  # validating this for github's provider a while back, but the field is
  # still required by the resource schema.
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

data "aws_iam_policy_document" "github_actions_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github_actions.arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_owner_login}@${var.github_owner_id}/${var.github_repo_name}@${var.github_repo_id}:ref:refs/heads/${var.github_deploy_branch}"
      ]
    }
  }
}

resource "aws_iam_role" "github_actions_deploy" {
  name               = var.github_actions_role_name
  assume_role_policy = data.aws_iam_policy_document.github_actions_trust.json
}

# Verified against the live "ReactAppDeployment" policy attached to the role
# (confirmed via IAM console) — exact statements, Sids, and resource scoping,
# not a reconstruction.
data "aws_iam_policy_document" "github_actions_permissions" {
  statement {
    sid       = "ListReactAppBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.app.arn]
  }

  statement {
    sid    = "DeployReactApp"
    effect = "Allow"
    actions = [
      "s3:PutObject",
      "s3:DeleteObject",
    ]
    resources = ["${aws_s3_bucket.app.arn}/*"]
  }

  statement {
    sid       = "InvalidateCloudFront"
    effect    = "Allow"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = [aws_cloudfront_distribution.app.arn]
  }
}

resource "aws_iam_role_policy" "github_actions_permissions" {
  name   = "ReactAppDeployment"
  role   = aws_iam_role.github_actions_deploy.id
  policy = data.aws_iam_policy_document.github_actions_permissions.json
}
