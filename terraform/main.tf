/*
 * Passing Terraform variables onto the userdata.sh file
 */

data "terraform_remote_state" "ctrl" {
  backend = "s3"

  config {
    bucket = "${var.terraformer_bucket}"
    key = "${var.product_code_tag}/${var.account_tag}/${var.environment_tag}/ctrl.tfstate"
  }
}

data "template_file" "userdata-app" {
  template = "${file("app-cloud-config.yaml")}"

  vars {
    class               = "${var.inventory_code_tag}"
    product_code_tag    = "${var.product_code_tag}"
    environment_tag     = "${var.environment_tag}"
    inventory_code_tag  = "${var.inventory_code_tag}"
    region              = "${var.aws_region}"
    cadvisor_url        = "${var.cadvisor_url}"
    cadvisor_port       = "${var.cadvisor_port}"
    artifact_repo       = "${var.app_artifact_repo}"
    artifact_version    = "${var.app_instance_artifact_version}"
    aws_profile         = "${var.aws_profile}"
    region              = "${var.aws_region}"
    ecr_host            = "${var.ecr_host}"
    product_name        = "${var.product_name}"
    instance_port       = "${var.app_instance_port}"
    redis_endpoint      = "${var.redis_endpoint}"
    s3_bucket_logs      = "${var.s3_bucket_logs}"
    ec2_log_dir         = "${var.ec2_log_dir}"
    docker_log_dir      = "${var.docker_log_dir}"
    elk_logs_endpoint   = "${var.elk_logs_endpoint}"
    env_config_path     = "${var.env_config_path}"
  }
}

resource "aws_elb" "app" {
  name                        = "${module.naming.aws_elb}"
  subnets                     = ["${split(",", module.networks.subnets[format("%s.%s.%s", var.aws_region, var.vpc, "pubin")] )}"]
  security_groups             = ["${aws_security_group.ecs_web.id}"]
  cross_zone_load_balancing   = true
  internal                    = "${var.app_elb_internal}"
  connection_draining         = true
  connection_draining_timeout = 600
  lifecycle {
    create_before_destroy = true
  }
  listener {
    instance_port      = "${var.app_instance_port}"
    instance_protocol  = "${var.app_instance_protocol}"
    lb_port            = "${var.app_elb_port}"
    lb_protocol        = "${var.app_elb_protocol}"
  }
  health_check {
    healthy_threshold   = "2"
    unhealthy_threshold = "4"
    timeout             = "60"
    target              = "${var.app_instance_protocol}:${var.app_instance_port}${var.app_instance_healthcheck_url}"
    interval            = "90"
  }
  tags {
    ProductCode   = "${var.product_code_tag}"
    Environment   = "${var.environment_tag}"
    InventoryCode = "${var.inventory_code_tag}"
  }
}

resource "aws_launch_configuration" "app" {
  depends_on = ["aws_iam_instance_profile.default"]

  name_prefix          = "${module.naming.aws_launch_configuration}"
  image_id             = "${module.ami.ami_id}"
  instance_type        = "${var.app_instance_type}"
  security_groups      = ["${module.networks.security_groups[format("%s.%s.%s", var.aws_region, var.vpc, "web")]}", "${module.networks.security_groups[format("%s.%s.%s", var.aws_region, var.vpc, "onprem")]}"]
  user_data            = "${data.template_file.userdata-app.rendered}"
  key_name             = "${var.ssh_key}"
  iam_instance_profile = "${aws_iam_instance_profile.default.name}"
  enable_monitoring    = "${var.enable_monitoring}"

  lifecycle {
    create_before_destroy = true
  }
}

#
# Internal micro service ec2 instance auto scaling group (in app subnet tier) not attached with any ELB
# (in real life, you may want to attach with an internal ELB which locates in the same subnet tier)
#
# There is no auto scaling policy defined so it always has the static size of EC2 instance(s)
#
resource "aws_autoscaling_group" "app" {
  name                       = "${aws_launch_configuration.app.name}"
  min_size                   = "${var.app_instance_min_count}"
  max_size                   = "${var.app_instance_max_count}"
  desired_capacity           = "${var.app_instance_min_count}"
  force_delete               = true
  health_check_type          = "${var.asg_health_check_type}"
  launch_configuration       = "${aws_launch_configuration.app.id}"
  load_balancers             = ["${aws_elb.app.id}"]
  vpc_zone_identifier        = ["${split(",", module.networks.subnets[format("%s.%s.%s", var.aws_region, var.vpc, "web")] )}"]
  termination_policies       = ["${var.asg_termination_policies}"]
  enabled_metrics            = ["GroupMinSize", "GroupMaxSize", "GroupDesiredCapacity", "GroupInServiceInstances", "GroupPendingInstances", "GroupStandbyInstances", "GroupTerminatingInstances", "GroupTotalInstances"]
  wait_for_capacity_timeout  = "10m"
  min_elb_capacity           = "1"

  lifecycle {
    create_before_destroy = true
  }

  tag {
    key                 = "Name"
    value               = "${module.naming.aws_autoscaling_group}app"
    propagate_at_launch = true
  }

  tag {
    key                 = "ProductCode"
    value               = "${var.product_code_tag}"
    propagate_at_launch = true
  }

  tag {
    key                 = "Environment"
    value               = "${var.environment_tag}"
    propagate_at_launch = true
  }

  tag {
    key                 = "InventoryCode"
    value               = "${var.inventory_code_tag}"
    propagate_at_launch = true
  }

  tag {
    key                 = "Prometheus80"
    value               = "enabled"
    propagate_at_launch = true
  }

  tag {
    key                 = "Prometheus"
    value               = "enabled"
    propagate_at_launch = true
  }
}
