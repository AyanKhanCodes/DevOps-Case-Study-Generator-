# ─────────────────────────────────────────────────────────────────────
# Puppet Manifest: Docker Installation & Service Management
#
# This manifest ensures that Docker is installed and running on the
# target server.  It is designed to run on Ubuntu/Debian systems.
#
# Usage:
#   sudo puppet apply infrastructure/puppet/manifests/init.pp
# ─────────────────────────────────────────────────────────────────────

# Ensure the package index is refreshed before installing packages
exec { 'apt-update':
  command => '/usr/bin/apt-get update -y',
  path    => ['/usr/bin', '/usr/sbin'],
  unless  => 'test -f /var/lib/apt/periodic/update-stamp',
}

# Install docker.io (the Ubuntu-packaged Docker engine)
package { 'docker.io':
  ensure  => installed,
  require => Exec['apt-update'],
}

# Install docker-compose plugin for multi-container orchestration
package { 'docker-compose-plugin':
  ensure  => installed,
  require => Package['docker.io'],
}

# Ensure the Docker service is running and enabled on boot
service { 'docker':
  ensure  => running,
  enable  => true,
  require => Package['docker.io'],
}

# Add the default 'ubuntu' user to the docker group so it can
# run containers without sudo
exec { 'docker-group-ubuntu':
  command => '/usr/sbin/usermod -aG docker ubuntu',
  unless  => '/usr/bin/groups ubuntu | /usr/bin/grep -q docker',
  require => Package['docker.io'],
}
