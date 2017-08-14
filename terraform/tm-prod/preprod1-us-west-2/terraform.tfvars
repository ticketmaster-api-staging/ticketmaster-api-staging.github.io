# DO NOT CHANGE
aws_profile = "tm-prod-Ops-Techops"
terraformer_bucket = "terraform.prod1.us-west-2.tmaws"

# Your Terraform Variables
# See Naming Standard: https://contegixapp1.livenation.com/confluence/display/AWS/Naming+Standards

aws_region = "us-west-2"
account_tag = "tm-prod"
product_code_tag = "PRD415"
inventory_code_tag = "ctrl"
environment_tag = "preprod1"
vpc = "preprod"
product_name = "ccp-schlesinger"

zone = "prod-tmaws.io"
public_zone = "pub-tmaws.io"
ssh_key = "cet-prod-west"
enable_monitoring = "false"

app_elb_internal = false
app_elb_dns_alias_name = "sh-controller"
app_instance_type = "t2.medium"
app_instance_min_count = "1"
app_instance_max_count = "1"
app_instance_ebs_optimized = "false"
app_artifact_repo = "tmhub.io/ccp-schlesinger/preprod1/ctrl"
app_instance_artifact_version = "4fbea0fe6044fa564ccca7fdf194d7e385551645"
app_instance_healthcheck_url = "/healthcheck"

redis_endpoint = "prd415-preprod1-cch.bsmqn4.clustercfg.usw2.cache.amazonaws.com"

ec2_log_dir = "/log"
elk_logs_endpoint="search-prd415-preprod1-elk-wr4sjlidv7qqpfdmrjafxkqnsy.us-east-1.es.amazonaws.com"
s3_bucket_logs="prd415.tm-prod.ccp-schlesinger.preprod1.us-east-1.tmaws-logs"