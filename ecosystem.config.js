module.exports = {
  apps: [{
    name: 'techpartner-database',
    script: 'server/index.ts',
    interpreter: 'tsx',
    env: {
      NODE_ENV: 'development',
      DATABASE_URL: 'postgresql://neondb_owner:npg_6GmN5JQnPXbg@ep-calm-snow-aev1ojm4-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      PORT: 5000
    },
    error_file: '/home/bander/.pm2/logs/techpartner-error.log',
    out_file: '/home/bander/.pm2/logs/techpartner-out.log',
    log_file: '/home/bander/.pm2/logs/techpartner-combined.log',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_restarts: 5,
    min_uptime: '5s'
  }]
}