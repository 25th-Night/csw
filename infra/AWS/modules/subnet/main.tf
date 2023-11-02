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

data "aws_vpc" "main" {
  id = var.vpc_id
}

resource "aws_subnet" "main" {
  vpc_id                  = data.aws_vpc.main.id
  cidr_block              = cidrsubnet(data.aws_vpc.main.cidr_block, 8, var.subnet_netnum)
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name = "server-subnet-${var.name}"
    Env  = var.env
  }
}

resource "aws_route_table_association" "main" {
  subnet_id      = aws_subnet.main.id
  route_table_id = var.route_table_id
}
