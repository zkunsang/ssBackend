const ReqStoryInfo = require('@ss/models/cmsController/ReqStoryInfo');
const StoryDao = require('@ss/daoMongo/StoryDao');

module.exports = async (ctx, next) => {
    const reqStoryInfo = new ReqStoryInfo(ctx.request.body);
    ReqStoryInfo.validModel(reqStoryInfo);

    const storyId = reqStoryInfo.getStoryId();
    const storyDao = new StoryDao(ctx.$dbMongo);

    const storyData = await storyDao.findOne({ storyId });
    if (!storyData) {
        ctx.status = 400;
        ctx.body.data = { message: 'no story data' };

        await next();
    }

    ctx.status = 200;
    ctx.body.data = storyData;

    await next();
}