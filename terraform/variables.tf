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
variable "ssl_certificate" {}
variable "ssl_folder" { default = "cert-prod" }

variable "app_elb_protocol" { default = "HTTPS" }
variable "app_elb_port" { default = "443" }
variable "app_elb_dns_alias_name" {}

variable "app_instance_protocol" { default = "HTTP" }
variable "app_instance_port" { default = "80" }
variable "app_instance_ssl_port" { default = "443" }
variable "app_instance_healthcheck_url" { default = "/healthcheck" }
variable "app_instance_type" {}
variable "app_instance_min_count" {}
variable "app_instance_max_count" {}
variable "app_instance_ebs_optimized" {}
variable "app_instance_artifact_version" {}
variable "app_artifact_repo" {}
variable "portal_url" {
  default = "developer-portal.staging.ticketmaster.com"
}
variable "drupal_portal_url" {
  default = "https://pantheon.staging.ticketmaster.com/open-platform/user/"
}

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


variable "asg_health_check_type" {
  default = "ELB"
}
variable "app_elb_internal" {
  default = "true"
}

