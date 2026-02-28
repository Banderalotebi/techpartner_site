module.exports = {
  apps: [{
    name: 'techpartner',
    script: './dist/index.cjs',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_file: '/tmp/techpartner.log',
    out_file: '/tmp/techpartner-out.log',
    error_file: '/tmp/techpartner-error.log',
    merge_logs: true
  }]
};
