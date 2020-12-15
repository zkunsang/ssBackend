const dbMongo = require('../dbMongo');
const StoryDao = require('../daoMongo/StoryDao');

const Story = require('../models/mongo/Story');
const Cache = require('./Cache');
const _ = require('lodash');

const tableId = 'story';

class StoryCacheModel {
    constructor() {
        this.storyList = null;
        this.storyMap = null;
    }

    async loadData(storyDao) {
        this.storyList = await storyDao.findAll();

        this.parseProductByItemId();
    }

    parseProductByItemId() {
        this.storyMap = _.keyBy(this.storyList, Story.Schema.STORY_ID.key);
    }

    get(storyId) {
        return this.storyMap[storyId];
    }

    getList() {
        return this.storyList;
    }

    getMap() {
        return this.storyMap;
    }
}

class StoryCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = StoryCacheModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new StoryDao(dbMongo);
    }

    get(storyId) {
        return this.currentCacheModel.get(storyId);
    }
    
    getList() {
        return this.currentCacheModel.getList();
    }

    getMap() {
        return this.currentCacheModel.getMap();
    }
}

module.exports = new StoryCache();