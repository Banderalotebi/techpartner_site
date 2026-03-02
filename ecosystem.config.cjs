module.exports = {
  apps: [
    {
      name: "techpartner",
      script: "npx",
      args: "tsx server/index.ts",
      cwd: "/home/ubuntu/techpartner",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 8080
      },
      log_file: "/tmp/techpartner.log",
      out_file: "/tmp/techpartner-out.log",
      error_file: "/tmp/techpartner-error.log",
      merge_logs: true,
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      watch: false,
      kill_timeout: 5000
    },
    {
      name: "content-director",
      script: "npx",
      args: "tsx scripts/content-director.ts",
      cwd: "/home/ubuntu/techpartner",
      instances: 1,
      exec_mode: "fork",
      cron_restart: "0 4 * * 3",
      autorestart: false,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "nightly-reflection",
      script: "npx",
      args: "tsx scripts/nightly-reflection.ts",
      cwd: "/home/ubuntu/techpartner",
      instances: 1,
      exec_mode: "fork",
      cron_restart: "0 3 * * *",
      autorestart: false,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
