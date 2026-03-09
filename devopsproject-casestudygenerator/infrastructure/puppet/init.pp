class docker_install {
  package { ['docker', 'docker.io']:
    ensure => installed,
  }

  service { 'docker':
    ensure  => running,
    enable  => true,
    require => Package['docker.io'],
  }
}

include docker_install
