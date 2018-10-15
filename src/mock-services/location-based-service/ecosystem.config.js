module.exports = {
  apps : [{
    name: 'Location Based Service',
    script: 'index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'dev',
      PORT_NUMBER: 5000
    },
    env_production: {
      NODE_ENV: 'prod',
      PORT_NUMBER: 5000
    }
  }]
};
