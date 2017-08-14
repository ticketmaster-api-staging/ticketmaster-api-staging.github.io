# DO NOT CHANGE
aws_profile = "tm-nonprod-Ops-Techops"
terraformer_bucket = "terraform.nonprod1.us-east-1.tmaws"

# Your Terraform Variables
# See Naming Standard: https://contegixapp1.livenation.com/confluence/display/AWS/Naming+Standards

aws_region = "us-east-1"
account_tag = "tm-nonprod"
product_code_tag = "PRD415"
inventory_code_tag = "ctrl-schl"
environment_tag = "qa2"
vpc = "qa"
product_name = "ccp-schlesinger"

zone = "nonprod-tmaws.io"
public_zone = "nonprod-tmaws.io"
ssh_key = "cet-qa-east"
enable_monitoring = "false"

app_elb_internal = true
app_elb_dns_alias_name = "sh-controller-schl"
app_instance_port = 80
app_instance_type = "t2.medium"
app_instance_min_count = "1"
app_instance_max_count = "1"
app_instance_ebs_optimized = "false"
app_artifact_repo = "tmhub.io/ccp-schlesinger/qa2/ctrl-schl"
app_instance_artifact_version = "latest"
app_instance_healthcheck_url = "/healthcheck"

redis_endpoint = "prd415-qa2-cache.i8ciyj.clustercfg.use1.cache.amazonaws.com"
env_config_path= "/app/env/qa2.env"

ec2_log_dir = "/log"
elk_logs_endpoint="search-prd415-qa2-elk-yj4c573j7dnx2lrcivjzmriumy.us-east-1.es.amazonaws.com"
s3_bucket_logs="prd415.tm-nonprod.ccp-schlesinger.qa2.us-east-1.tmaws-logs"
