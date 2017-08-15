#
# Web access (from Fastly and office networks)
#

#data "fastly_ip_ranges" "fastly" {}

resource "aws_security_group" "ecs_web" {
  name = "${module.naming.aws_security_group}_fastly_inbound"
  description = "Access to Web App"

  vpc_id = "${module.networks.vpcs[format("%s.%s", var.aws_region, var.vpc)]}"

  ingress {
    from_port   = "80"
    to_port     = "80"
    protocol    = "tcp"
    cidr_blocks = [ "${var.tm_public_ips}", "${var.fastly_public_ips}", "10.188.0.0/8" ]
  }
  
  ingress {
    from_port   = "8081"
    to_port     = "8081"
    protocol    = "tcp"
    cidr_blocks = [ "${var.tm_public_ips}", "${var.fastly_public_ips}", "10.188.0.0/8" ]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags {
    Name          = "${module.naming.aws_security_group}ecs_web"
    ProductCode   = "${var.product_code_tag}"
    Environment   = "${var.environment_tag}"
    InventoryCode = "${var.inventory_code_tag}"
  }

}
