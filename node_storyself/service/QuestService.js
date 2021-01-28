const Service = require('../service/Service');
const ItemMaterial = require('../models/mongo/ItemMaterial');

const ItemCache = require('../dbCache/ItemCache');
const ItemMaterialCache = require('../dbCache/ItemMaterialCache');

const SSError = require('../error');

class ItemService extends Service {
    constructor() {
        super();
    }
}

module.exports = ItemService;