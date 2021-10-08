module.exports = {
  apps: [{
    name: 'template-project',
    script: 'node',
    args: 'dist/server/index.js run',
    exp_backoff_restart_delay: 100,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
