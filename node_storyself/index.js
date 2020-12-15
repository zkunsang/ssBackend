const moduleAlias = require('module-alias');
moduleAlias.addAlias('@ss', __dirname);

module.exports.configs = new (require('./configs'))(process.env.NODE_ENV);
