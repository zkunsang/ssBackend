const Model = require('..')

const ValidateUtil = require('../../util/ValidateUtil')
const DateUtil = require('../../util/DateUtil');
const ValidType = ValidateUtil.ValidType;

const moment = require('moment')

const Schema = {
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    PURCHASE_DATE: { key: 'purchaseDate', required: true, type: ValidType.UNIX_TIMESTAMP },
    PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
    COST: { key: 'cost', required: true, type: ValidType.NUMBER },
}

class ProductLog extends Model {
    constructor({ uid, productId, cost, purchaseDate }) {
        super();
        this[Schema.UID.key] = uid;
        this[Schema.PRODUCT_ID.key] = productId;
        this[Schema.COST.key] = cost;
        this[Schema.PURCHASE_DATE.key] = moment(purchaseDate).format(DateUtil.DEFAULT_FORMAT);
    }
}

module.exports = ProductLog;
module.exports.Schema = Schema;