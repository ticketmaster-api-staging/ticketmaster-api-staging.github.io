variable terraformer_bucket {}

variable "product_name" {}
variable "product_code_tag" {}
variable "inventory_code_tag" {}
variable "account_tag" {}
variable "environment_tag" {}
variable "vpc" {}

variable "zone" { default = "nonprod-tmaws.io" }
variable "public_zone" { default = "nonprod-tmaws.io" }
variable "ssh_key" {}
variable "enable_monitoring" {}

variable "app_elb_protocol" { default = "HTTP" }
variable "app_elb_port" { default = "80" }
variable "app_elb_dns_alias_name" {}

variable "app_instance_protocol" { default = "HTTP" }
variable "app_instance_port" { default = "80" }
variable "app_instance_healthcheck_url" { default = "/healthcheck" }
variable "app_instance_type" {}
variable "app_instance_min_count" {}
variable "app_instance_max_count" {}
variable "app_instance_ebs_optimized" {}
variable "app_instance_artifact_version" {}
variable "app_artifact_repo" {}

variable "s3_bucket_logs" {}
variable "elk_logs_endpoint" {}

variable "asg_termination_policies" {
  default = "OldestLaunchConfiguration"
}

##### Starndard Metrics Trending/Monitoring stuffs #####
variable "cadvisor_url" {
  default = "https://github.com/google/cadvisor/releases/download/v0.22.0/cadvisor"
}

variable "cadvisor_port" {
  default = 4914
}

variable "ec2_log_dir" { default = "/log" }
variable "ecr_host" { default = "tmhub.io" }

variable "docker_log_dir" { default = "/log" }
variable "redis_endpoint" {}
variable "env_config_path" {}


variable "asg_health_check_type" {
  default = "ELB"
}
variable "app_elb_internal" {
  default = "true"
}

variable "tm_public_ips" { default = [ "216.103.134.0/24", "209.104.62.0/24" ] }
variable "fastly_public_ips" { default = [ "23.235.32.0/20",
  "43.249.72.0/22",
  "103.244.50.0/24",
  "103.245.222.0/23",
  "103.245.224.0/24",
  "104.156.80.0/20",
  "151.101.0.0/16",
  "157.52.64.0/18",
  "172.111.64.0/18",
  "185.31.16.0/22",
  "199.27.72.0/21",
  "199.232.0.0/16",
  "202.21.128.0/24",
  "203.57.145.0/24" ] }
