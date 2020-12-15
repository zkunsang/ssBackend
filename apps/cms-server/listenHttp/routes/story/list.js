const StoryDao = require('@ss/daoMongo/storyDao');
const ReqStoryList = require('@ss/models/cmsController/ReqStoryList');


module.exports = async (ctx, next) => {
    const reqStoryList = new ReqStoryList(ctx.request.body);
    ReqStoryList.validModel(reqStoryList);

    const storyDao = new StoryDao(ctx.$dbMongo);
    const storyList = await storyDao.findAll();

    ctx.status = 200;
    ctx.body.data = storyList;

    await next();
}