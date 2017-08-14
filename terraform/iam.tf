#
# This is required so the application can authenticate on the EC2 instance without using aws credentials
#
resource "aws_iam_role" "default" {
  name = "${module.naming.aws_iam_role}-default"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

#
# This is required so the EC2 instance able to pull docker image from ECR docker registry
#
resource "aws_iam_role_policy" "AmazonEC2ContainerRegistryReadOnly" {
  name   = "${module.naming.aws_iam_policy}-AmazonEC2ContainerRegistryReadOnly"
  role   = "${aws_iam_role.default.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetRepositoryPolicy",
        "ecr:DescribeRepositories",
        "ecr:ListImages",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

#
# This is required so the EC2 instance able to push metrics to CloudWatch
#
resource "aws_iam_role_policy" "AmazonCloudWatchFullAccess" {
  name   = "${format("%s.%s.%s", var.product_code_tag, var.environment_tag, var.aws_region)}-AmazonCloudWatchFullAccess"
  role   = "${aws_iam_role.default.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:*"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_policy" "S3LogBucketFullAccess" {
  name        = "${lower(format("%s.%s.%s.%s.%s.tmaws", var.product_code_tag, var.account_tag, var.product_name, var.environment_tag, var.aws_region))}-logs-${var.inventory_code_tag}-S3LogBucketFullAccess"
  path        = "/"
  description = "Allow full access to the product s3 bucket arn:aws:s3:::${var.product_code_tag}.${var.account_tag}.${var.product_name}.${var.environment_tag}.${var.aws_region}.tmaws-logs"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::${var.s3_bucket_logs}"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::${var.s3_bucket_logs}/*"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "EC2S3LogsBucketFullAccess" {
  name   = "${format("%s.%s.%s.tmaws", var.product_code_tag, var.environment_tag, var.aws_region)}-S3LogBucketFullAccess"
  role   = "${aws_iam_role.default.id}"
  policy = "${aws_iam_policy.S3LogBucketFullAccess.policy}"
}


#
# This is required so EC2 instance has an instance profile attached
#
resource "aws_iam_instance_profile" "default" {
  name = "${module.naming.aws_iam_instance_profile}-ctrl"

  roles = [
    "${aws_iam_role.default.id}",
  ]
}
