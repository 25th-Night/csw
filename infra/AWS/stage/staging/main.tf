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
  name             = "csw"
  env              = "staging"
  ami              = "ami-0c9c942bd7bf113a2"
  instance_type    = "t2.micro"
  port_start       = 80
  port_end         = 80
  init_script_path = "init_script.tftpl"
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

module "subnet" {
  source = "../../modules/subnet"

  env    = local.env
  vpc_id = module.vpc.vpc_id
}

module "server" {
  source = "../../modules/server"

  name                = local.name
  env                 = local.env
  vpc_id              = module.vpc.vpc_id
  subnet_id           = module.subnet.subnet_id
  sc_port_range_start = local.port_start
  sc_port_range_end   = local.port_end
  ami                 = local.ami
  instance_type       = local.instance_type
  init_script_path    = local.init_script_path
  init_script_envs = {
    username                    = var.username
    password                    = var.password
    aws_access_key              = var.aws_access_key
    aws_secret_key              = var.aws_secret_key
    django_secret_key           = var.django_secret_key
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
