#
# This is required so the application can authenticate on the EC2 instance without using aws credentials
#
resource "aws_iam_role" "default-1" {
  name = "${module.naming.aws_iam_role}-default-1"

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
  role   = "${aws_iam_role.default-1.id}"
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
  role   = "${aws_iam_role.default-1.id}"
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

#
# This is required so EC2 instance has an instance profile attached
#
resource "aws_iam_instance_profile" "default-1" {
  name = "${module.naming.aws_iam_instance_profile}-ctrl"

  roles = [
    "${aws_iam_role.default-1.id}",
  ]
}
