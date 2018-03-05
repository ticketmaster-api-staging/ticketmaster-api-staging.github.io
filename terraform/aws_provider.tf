variable "aws_profile" {}
variable "aws_region" {}

provider "aws" {
  region = "${var.aws_region}"
  profile = "${var.aws_profile}"
}
