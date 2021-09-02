const dbMongo = require('../dbMongo');
const SaleEventDao = require('../daoMongo/SaleEventDao');

const Cache = require('./Cache');

const ArrayUtil = require('../util/ArrayUtil');
const SaleStoryEvent = require('@ss/models/mongo/SaleStoryEvent');
const { SaleEventTarget } = require('@ss/util/ValidateUtil');
const StoryCache = require('./StoryCache');

const tableId = 'saleEvent';

class SaleEventCacheModel {
    constructor() {
        this.saleEventList = null;
        this.saleEventMap = null;
    }

    async loadData(saleEventDao) {
        this.saleEventList = await saleEventDao.findAll();
    }

    getSaleInfo(storyId, now) {
        const storySaleList = this.saleEventList[0].story;
        for (let i = 0; i < storySaleList.length; i++) {
            const storySale = storySaleList[i];
            if (storySale.startDate > now / 1000) continue;
            if (storySale.endDate < now / 1000) continue;

            if (storySale.target === SaleEventTarget.ALL) return storySale;

            if (storySale.target === SaleEventTarget.GROUP) {
                const storyData = StoryCache.get(storyId);
                if (storyData.publisher === storySale.publisher) return storySale;
            }

            if (storySale.target === SaleEventTarget.SPECIFIC) {
                const _specific = storySale.storyList.includes(storyId)
                if (_specific) return storySale;
            }
        }
    }
}

class SaleEventCache extends Cache {
    constructor() {
        super();
        this.cacheModel = SaleEventCacheModel;
        this.tableId = tableId;
    }

    async ready() {
        this.dao = new SaleEventDao(dbMongo);
    }

    getSaleInfo(storyId, now) {
        return this.currentCacheModel.getSaleInfo(storyId, now);
    }
}

module.exports = new SaleEventCache();