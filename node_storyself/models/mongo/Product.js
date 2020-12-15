const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    PRODUCT_ID: { key: 'productId', required: true, type: ValidType.STRING },
    GROUP_ID: { key: 'groupId', required: false, type: ValidType.STRING },
    PRODUCT_TYPE: { key: 'productType', required: true, type: ValidType.STRING },
    COST_KR: { key: 'costKr', required: true, type: ValidType.NUMBER },
    COST_KR_ORIGIN: { key: 'costKrOrigin', required: true, type: ValidType.NUMBER },
    GOOGLE: { key: 'google', required: true, type: ValidType.STRING },
    APPLE: { key: 'apple', required: true, type: ValidType.STRING },
    START_DATE: { key: 'startDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    END_DATE: { key: 'endDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    SERVER_LIMIT: { key: 'serverLimit', required: true, type: ValidType.NUMBER },
    USER_LIMIT: { key: 'userLimit', required: true, type: ValidType.NUMBER },
    TAG_COLOR: { key: 'tagColor', required: true, type: ValidType.STRING },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },
}

class Product extends Model {
    constructor({ productId, groupId, productType, costKr, costKrOrigin, apple, google, startDate, endDate, serverLimit, userLimit, tagColor }) {
        super();
        
        this[Schema.PRODUCT_ID.key] = ValidateUtil.setNullUndefined(productId);
        this[Schema.GROUP_ID.key] = ValidateUtil.setNullUndefined(groupId);
        this[Schema.PRODUCT_TYPE.key] = ValidateUtil.setNullUndefined(productType);
        this[Schema.COST_KR.key] = ValidateUtil.setNullUndefined(costKr);
        this[Schema.COST_KR_ORIGIN.key] = ValidateUtil.setNullUndefined(costKrOrigin);
        this[Schema.GOOGLE.key] = ValidateUtil.setNullUndefined(google);
        this[Schema.APPLE.key] = ValidateUtil.setNullUndefined(apple);
        this[Schema.START_DATE.key] = ValidateUtil.setNullUndefined(startDate);
        this[Schema.END_DATE.key] = ValidateUtil.setNullUndefined(endDate);
        this[Schema.SERVER_LIMIT.key] = ValidateUtil.setNullUndefined(serverLimit);
        this[Schema.USER_LIMIT.key] = ValidateUtil.setNullUndefined(userLimit);
        this[Schema.TAG_COLOR.key] = ValidateUtil.setNullUndefined(tagColor);
    }

    setUpdateDate(updateDate) {
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getProductId() {
        return this[Schema.PRODUCT_ID.key];
    }
}

module.exports = Product;
module.exports.Schema = Schema;