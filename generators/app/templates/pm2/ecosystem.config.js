module.exports = {
  apps : [{
    name: "<%= appName %>",
    script: "./dist/server.js",
    error_file: "./logs/error.log",
    out_file: "./logs/out.log",
    time: true,
    env_development: {
      NODE_ENV: "development",
      NODE_CONFIG_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production",
      NODE_CONFIG_ENV: "production"
    }
  }],
};
