const ReqStoryUpdateMany = require('@ss/models/cmsController/ReqStoryUpdateMany');
const StoryDao = require('@ss/daoMongo/StoryDao');

async function insertStoryList(storyDao, storyList, updateDate) {
    const insertStoryList = StoryDao.mappingList(storyList);
    for(const story of insertStoryList) {
        story.setUpdateDate(updateDate);
    }

    await storyDao.insertMany(insertStoryList);
}

module.exports = async (ctx, next) => {
    const updateDate = ctx.$date;
    const reqStoryMany = new ReqStoryUpdateMany(ctx.request.body);
    ReqStoryUpdateMany.validModel(reqStoryMany);

    const storyDao = new StoryDao(ctx.$dbMongo);
    
    const storyList = reqStoryMany.getStoryList();
    
    await storyDao.deleteAll();
    await insertStoryList(storyDao, storyList, updateDate);
    
    ctx.status = 200;
    ctx.body.data = {};
    await next();
}