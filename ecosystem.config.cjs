module.exports = {
  apps: [
    {
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
    },
    {
      name: 'content-director',
      script: 'npx',
      args: 'tsx scripts/content-director.ts',
      instances: 1,
      cron_restart: '0 4 * * 3',
      autorestart: false,
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      log_file: '/tmp/content-director.log',
      out_file: '/tmp/content-director-out.log',
      error_file: '/tmp/content-director-error.log'
    }
  ]
};
