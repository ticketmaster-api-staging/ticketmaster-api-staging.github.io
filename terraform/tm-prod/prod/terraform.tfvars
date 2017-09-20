# DO NOT CHANGE
aws_profile = "tm-prod-Ops-Techops"
terraformer_bucket = "terraform.prod1.us-east-1.tmaws"

# Your Terraform Variables
# See Naming Standard: https://contegixapp1.livenation.com/confluence/display/AWS/Naming+Standards

aws_region = "us-east-1"
account_tag = "tm-prod"
product_code_tag = "PRD1585"
inventory_code_tag = "ctrl"
environment_tag = "prod"
vpc = "prod"
product_name = "dpa-portal"

zone = "nonprod-tmaws.io"
public_zone = "nonprod-tmaws.io"
ssh_key = "cet-prod-east"
enable_monitoring = "false"
ssl_certificate = "arn:aws:acm:us-east-1:889199535989:certificate/ceac2df4-e4c6-406f-8743-56f72ac9700a"

app_elb_internal = true
app_elb_dns_alias_name = "dpa-controller"
app_instance_port = 80
app_instance_type = "t2.medium"
app_instance_min_count = "1"
app_instance_max_count = "1"
app_instance_ebs_optimized = "false"
app_artifact_repo = "tmhub.io/dpa-portal/prod/ctrl"
app_instance_artifact_version = "latest"
app_instance_healthcheck_url = "/"
portal_url = "developer.ticketmaster.com"
drupal_portal_url = "https://dev-livenation.devportal.apigee.com/open-platform/user/"
# drupal_portal_url = "https://developer-acct.ticketmaster.com/open-platform/user/"

ec2_log_dir = "/log"
