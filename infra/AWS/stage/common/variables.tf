variable "vpc_id" {
  type      = string
  sensitive = true
}

variable "subnet_id1" {
  type = string
}

variable "subnet_id2" {
  type = string
}

variable "instance_id" {
  type = string
}

variable "acm_domain" {
  type = string
}

variable "domain" {
  type = string
}

variable "sub_domain1" {
  type = string
}

variable "sub_domain2" {
  type = string
}
