const moduleAlias = require('module-alias');
moduleAlias.addAlias('@ss', __dirname);
console.log("node_storyself - init");

module.exports.configs = new (require('./configs'))(process.env.NODE_ENV);
