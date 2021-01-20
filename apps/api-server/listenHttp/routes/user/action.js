const ReqUserAction = require('@ss/models/controller/ReqUserAction');
const ActionLogDao = require('@ss/daoMongo/ActionLogDao');
const ActionLog = require('@ss/models/apilog/ActionLog');

function createActionLog(uid, storyId, actionList) {
    const retActionList = [];

    for(const action of actionList) {
        retActionList.push(new ActionLog({ uid, storyId, ...action }));
    }

    return retActionList;
}

module.exports = async (ctx, next) => {
    const reqUserAction = new ReqUserAction(ctx.request.body);
    ReqUserAction.validModel(reqUserAction);

    const dbMongo = ctx.$dbMongo;
    const userInfo = ctx.$userInfo;

    const uid = userInfo.getUID();
    const actionList = reqUserAction.getActionList();
    const storyId = reqUserAction.getStoryId();

    const actionLogDao = new ActionLogDao(dbMongo);
    await actionLogDao.insertMany(createActionLog(uid, storyId, actionList));
    
    ctx.status = 200;
    ctx.body.data = {};

    await next();
};