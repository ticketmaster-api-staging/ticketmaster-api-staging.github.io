resource "aws_route53_record" "app" {
  name = "${var.app_elb_dns_alias_name}.${var.environment_tag}.${var.aws_region}"

  zone_id = "${module.public_zones.zone_id}"
  type    = "A"

  alias {
    name = "${aws_elb.app.dns_name}"
    zone_id = "${aws_elb.app.zone_id}"
    evaluate_target_health = true
  }
}
