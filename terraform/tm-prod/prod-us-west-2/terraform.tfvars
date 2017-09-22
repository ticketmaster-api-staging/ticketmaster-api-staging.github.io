# DO NOT CHANGE
aws_profile = "tm-prod-Ops-Techops"
terraformer_bucket = "terraform.prod1.us-west-2.tmaws"

# Your Terraform Variables
# See Naming Standard: https://contegixapp1.livenation.com/confluence/display/AWS/Naming+Standards
aws_region = "us-west-2"
account_tag = "tm-prod"
product_code_tag = "PRD1585"
inventory_code_tag = "ctrl"
environment_tag = "prod"
vpc = "prod"
product_name = "dpa-portal"

zone = "prod-tmaws.io"
public_zone = "prod-tmaws.io"
ssh_key = "cet-prod-west"
enable_monitoring = "false"
ssl_certificate = "arn:aws:acm:us-west-2:350611111791:certificate/ddcec90a-e19d-47a3-b83e-646a188ce93c"
ssl_folder = "cert-prod"

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