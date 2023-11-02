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

locals {
  name = "csw"
  env  = "staging"
}


module "acm" {
  source = "../../modules/acm"

  acm_domain = var.acm_domain

}

module "loadBalancer" {
  source = "../../modules/loadBalancer"

  name        = local.name
  env         = local.env
  vpc_id      = var.vpc_id
  subnet_id1  = var.subnet_id1
  subnet_id2  = var.subnet_id2
  instance_id = var.instance_id
  acm_arn     = module.acm.arn

}

module "route53" {
  source = "../../modules/route53"

  domain = var.domain

}

module "r53_record_main" {
  source = "../../modules/r53_record"

  lb_arn          = module.loadBalancer.arn
  route53_zone_id = module.route53.route53_zone_id
  sub_domain      = var.sub_domain1

}

module "r53_record_url" {
  source = "../../modules/r53_record"

  lb_arn          = module.loadBalancer.arn
  route53_zone_id = module.route53.route53_zone_id
  sub_domain      = var.sub_domain2

}
