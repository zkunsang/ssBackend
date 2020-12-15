const Model = require('../../models');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_LIST: { key: 'storyList', required: true, type: ValidType.ARRAY },
    COUPON_ID: { key: 'couponId', required: false, type: ValidType.STRING },
}

class ReqShopStory extends Model {
    constructor({ storyList, couponId }) {
        super();
        this[Schema.STORY_LIST.key] = storyList;
        this[Schema.COUPON_ID.key] = couponId;
    }

    getStoryList() {
        return this[Schema.STORY_LIST.key];
    }

    getCouponId() {
        return this[Schema.COUPON_ID.key];
    }
}

module.exports = ReqShopStory;
module.exports.Schema = Schema;