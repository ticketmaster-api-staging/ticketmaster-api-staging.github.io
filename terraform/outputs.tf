output app_alb_url {
  value = "${var.app_elb_protocol}://${aws_route53_record.app.fqdn}:${var.app_elb_port}"
}

output dns {
  value = "${aws_route53_record.app.fqdn}"
}
