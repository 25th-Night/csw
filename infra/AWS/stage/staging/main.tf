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
  name                      = "csw"
  env                       = "staging"
  ami                       = "ami-0c9c942bd7bf113a2"
  instance_type             = "t2.micro"
  init_script_path          = "init_script.tftpl"
  subnet_name1              = "csw"
  subnet_netnum1            = 1
  subnet_availability_zone1 = "ap-northeast-2a"
  subnet_name2              = "csw2"
  subnet_netnum2            = 2
  subnet_availability_zone2 = "ap-northeast-2b"
}

module "s3" {
  source = "../../modules/s3"

  name = local.name
  env  = local.env

}

module "vpc" {
  source = "../../modules/vpc"

  env = local.env
}

module "subnet1" {
  source = "../../modules/subnet"

  name              = local.subnet_name1
  env               = local.env
  vpc_id            = module.vpc.vpc_id
  route_table_id    = module.vpc.route_table_id
  subnet_netnum     = local.subnet_netnum1
  availability_zone = local.subnet_availability_zone1
}

module "subnet2" {
  source = "../../modules/subnet"

  name              = local.subnet_name2
  env               = local.env
  vpc_id            = module.vpc.vpc_id
  route_table_id    = module.vpc.route_table_id
  subnet_netnum     = local.subnet_netnum2
  availability_zone = local.subnet_availability_zone2
}

module "server" {
  source = "../../modules/server"

  name             = local.name
  env              = local.env
  vpc_id           = module.vpc.vpc_id
  subnet_id        = module.subnet1.subnet_id
  ami              = local.ami
  instance_type    = local.instance_type
  init_script_path = local.init_script_path
  init_script_envs = {
    username                    = var.username
    password                    = var.password
    aws_access_key              = var.aws_access_key
    aws_secret_key              = var.aws_secret_key
    django_secret_key           = var.django_secret_key
    django_settings_module      = var.django_settings_module
    user_postgres_db            = var.user_postgres_db
    user_postgres_user          = var.user_postgres_user
    user_postgres_password      = var.user_postgres_password
    user_postgres_port          = var.user_postgres_port
    shortener_postgres_db       = var.shortener_postgres_db
    shortener_postgres_user     = var.shortener_postgres_user
    shortener_postgres_password = var.shortener_postgres_password
    shortener_postgres_port     = var.shortener_postgres_port
    ssh_key                     = var.ssh_key
    jwt_signing_key             = var.jwt_signing_key
  }
}


# module "acm" {
#   source = "../../modules/acm"

#   acm_domain = var.acm_domain
# }


# module "loadBalancer" {
#   source = "../../modules/loadBalancer"

#   name        = local.name
#   env         = local.env
#   vpc_id      = module.vpc.vpc_id
#   subnet_id1  = module.subnet1.subnet_id
#   subnet_id2  = module.subnet2.subnet_id
#   instance_id = module.server.instance_id
#   acm_arn     = module.acm.arn
# }

# module "route53" {
#   source = "../../modules/route53"

#   domain = var.domain
# }
