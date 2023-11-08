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

resource "aws_lb_target_group" "main" {
  name     = "${var.name}-lb-tg-${var.env}"
  port     = 80
  protocol = "TCP"
  vpc_id   = var.vpc_id
  health_check {
    protocol            = "TCP"
    port                = 80
    interval            = 30
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group_attachment" "main" {
  target_group_arn = aws_lb_target_group.main.arn
  target_id        = var.instance_id
  port             = 80
}

resource "aws_lb" "main" {
  name               = "${var.name}-lb-${var.env}"
  internal           = false
  load_balancer_type = "application"
  subnets = [
    var.subnet_id1, var.subnet_id2,
  ]

  tags = {
    Name = "${var.name}"
    Env  = "${var.env}"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

# resource "aws_lb_listener" "https" {
#   load_balancer_arn = aws_lb.main.arn
#   port              = "443"
#   protocol          = "HTTPS"
#   ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
#   certificate_arn   = var.acm_arn

#   default_action {
#     type             = "forward"
#     target_group_arn = aws_lb_target_group.main.arn
#   }
# }
