const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.dev.conf');
const WebpackDevServer = require('webpack-dev-server');

const compiler = webpack(config);

const options = Object.assign({}, config.devServer, {
  stats: {
    colors: true
  }
})

WebpackDevServer.addDevServerEntrypoints(config, options);
const server = new WebpackDevServer(compiler, options);

server.listen(8080);

console.log('Listening at port: 8080');