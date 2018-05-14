// 该文件演示使用Node API调用webpack进行打包。

const webpack = require('webpack');
const config = require('./webpack.config');
const fs = require('fs');
const compiler = webpack(config);

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive(__dirname + '/dist');
compiler.run((err, stats) => {
    if(err) {
        console.error(err);
    }
    else {
        console.log(stats.hash);
    }
});