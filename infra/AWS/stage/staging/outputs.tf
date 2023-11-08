output "server_public_ip" {
  value = module.server.public_ip
}

output "bucket_regional_dns" {
  value = module.s3.bucket_regional_dns
}

# output "lb_domain" {
#   value = module.loadBalancer.domain
# }

# output "route53_name_servers" {
#   value = module.route53.route53_name_servers
# }

# output "route53_zone_id" {
#   value = module.route53.route53_zone_id
# }
