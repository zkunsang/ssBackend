const Service = require('../service/Service');
const SSError = require('../error');
const StoryCache = require('@ss/dbCache/StoryCache');

class StoryService extends Service {
    constructor() {
        super();
    }

    async ready() { }

    getStoryList(storyIdList) {
        Service.Validate.checkEmptyArray(storyIdList);
        return this.filterStoryList(storyIdList);
    }

    filterStoryList(storyIdList) {
        const noExistStory = [];
        const existStory = [];

        for(const storyId of storyIdList) {
            const storyData = StoryCache.get(storyId);
            if(!storyData) {
                noExistStory.push(storyId);
            }
            existStory.push(storyData);
        }

        if (noExistStory.length > 0) {
            throw new SSError.Service(SSError.Service.Code.noExistItemList, `[${noExistStory.join(',')}] not exist story`)
        }

        return existStory;
    }
}

module.exports = StoryService;