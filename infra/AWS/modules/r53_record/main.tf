terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

data "aws_lb" "main" {
  arn = var.lb_arn
}

resource "aws_route53_record" "main" {
  zone_id = var.route53_zone_id
  name    = var.sub_domain
  type    = "A"

  alias {
    name                   = data.aws_lb.main.dns_name
    zone_id                = data.aws_lb.main.zone_id
    evaluate_target_health = false
  }
}
