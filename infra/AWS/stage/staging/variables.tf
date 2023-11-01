variable "username" {
  type      = string
  sensitive = true
}

variable "password" {
  type      = string
  sensitive = true
}

variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type = string
}

variable "django_secret_key" {
  type      = string
  sensitive = true
}

variable "user_postgres_db" {
  type      = string
  sensitive = true
}

variable "user_postgres_user" {
  type      = string
  sensitive = true
}

variable "user_postgres_password" {
  type      = string
  sensitive = true
}

variable "user_postgres_port" {
  type    = number
  default = 5432
}

variable "shortener_postgres_db" {
  type      = string
  sensitive = true
}

variable "shortener_postgres_user" {
  type      = string
  sensitive = true
}

variable "shortener_postgres_password" {
  type      = string
  sensitive = true
}

variable "shortener_postgres_port" {
  type    = number
  default = 5432
}

variable "jwt_signing_key" {
  type = string
}

variable "ssh_key" {
  type = string
}
