output "domain" {
  value = aws_lb.main.dns_name
}

output "arn" {
  value = aws_lb.main.arn
}
