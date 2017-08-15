# DO NOT CHANGE
aws_profile = "tm-nonprod-Ops-Techops"
terraformer_bucket = "terraform.nonprod1.us-east-1.tmaws"

# Your Terraform Variables
# See Naming Standard: https://contegixapp1.livenation.com/confluence/display/AWS/Naming+Standards

aws_region = "us-east-1"
account_tag = "tm-nonprod"
product_code_tag = "PRD1491"
inventory_code_tag = "ctrl"
environment_tag = "dev"
vpc = "qa"
product_name = "dpa-portal"

zone = "nonprod-tmaws.io"
public_zone = "nonprod-tmaws.io"
ssh_key = "cet-qa-east"
enable_monitoring = "false"

app_elb_internal = true
app_elb_dns_alias_name = "dpa-controller"
app_instance_port = 8081
app_instance_type = "t2.medium"
app_instance_min_count = "1"
app_instance_max_count = "1"
app_instance_ebs_optimized = "false"
app_artifact_repo = "tmhub.io/dpa-portal/dev/ctrl"
app_instance_artifact_version = "latest"
app_instance_healthcheck_url = "/healthcheck"

ec2_log_dir = "/log"
