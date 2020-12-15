const moduleAlias = require('module-alias');
moduleAlias.addAlias('@app', __dirname);

require('../configs');
require('../node_extensions');
require('../node_storyself');