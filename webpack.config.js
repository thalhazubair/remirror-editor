const DotenvWebpackPlugin = require('dotenv-webpack');

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    config.plugins.push(
      new DotenvWebpackPlugin({
        systemvars: true,
      })
    );
    return config;
  },
};
