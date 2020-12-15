const ReqStoryCreate = require('@ss/models/cmsController/ReqStoryCreate');
const StoryDao = require('@ss/daoMongo/StoryDao');
const Story = require('@ss/models/mongo/Story');
const moment = require('moment');

module.exports = async (ctx, next) => {
    const createDate = moment().unix();
    const reqStoryCreate = new ReqStoryCreate(ctx.request.body);
    ReqStoryCreate.validModel(reqStoryCreate);

    const storyId = reqStoryCreate.getStoryId();
    const storyDao = new StoryDao(ctx.$dbMongo);

    const storyData = await storyDao.findOne({ storyId });
    if (storyData) {
        ctx.status = 400;
        ctx.body.data = { message: 'already exist story' };

        await next();
        return;
    }

    const insertStoryData = new Story(reqStoryCreate);
    insertStoryData.setVersion(1);
    insertStoryData.setUpdateDate(createDate);
    await storyDao.insertOne(insertStoryData);

    ctx.status = 200;
    ctx.body.data = {};

    await next();

}