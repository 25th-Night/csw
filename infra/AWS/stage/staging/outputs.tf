output "server_public_ip" {
  value = module.server.public_ip
}

output "bucket_bucket_regional_dns" {
  value = module.s3.bucket_regional_dns
}
