# ─────────────────────────────────────────────────────────────────────
# Terraform Configuration: AWS EC2 Instance for DevOps Case Study App
#
# This script provisions a single t2.micro EC2 instance on the AWS
# free tier, running Ubuntu 22.04.  A security group is created to
# allow SSH (22) and application traffic (8080) inbound, with all
# outbound traffic permitted.
#
# Prerequisites:
#   - AWS CLI configured with valid credentials
#   - Terraform >= 1.0 installed
#
# Usage:
#   terraform init
#   terraform plan
#   terraform apply
# ─────────────────────────────────────────────────────────────────────

# ── Provider ──────────────────────────────────────────────────────────
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# ── Variables ─────────────────────────────────────────────────────────
variable "instance_type" {
  description = "EC2 instance type (t2.micro for free tier)"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "Name of an existing EC2 key pair for SSH access"
  type        = string
  default     = "devops-casestudy-key"
}

# ── Data: Latest Ubuntu 22.04 AMI ─────────────────────────────────────
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ── Security Group ────────────────────────────────────────────────────
resource "aws_security_group" "casestudy_sg" {
  name        = "casestudy-app-sg"
  description = "Allow SSH and application traffic for DevOps Case Study Generator"

  # SSH access
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Application HTTP traffic on port 8080
  ingress {
    description = "App HTTP (port 8080)"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name    = "casestudy-app-sg"
    Project = "DevOps-Case-Study-Generator"
  }
}

# ── EC2 Instance ──────────────────────────────────────────────────────
resource "aws_instance" "casestudy_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.casestudy_sg.id]

  # User data script: install Docker on first boot
  user_data = <<-EOF
    #!/bin/bash
    set -e
    apt-get update -y
    apt-get install -y docker.io docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ubuntu
  EOF

  tags = {
    Name    = "casestudy-generator-server"
    Project = "DevOps-Case-Study-Generator"
  }
}

# ── Outputs ───────────────────────────────────────────────────────────
output "instance_public_ip" {
  description = "Public IP of the provisioned EC2 instance"
  value       = aws_instance.casestudy_server.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_instance.casestudy_server.public_ip}"
}

output "app_url" {
  description = "URL to access the running application"
  value       = "http://${aws_instance.casestudy_server.public_ip}:8080"
}
