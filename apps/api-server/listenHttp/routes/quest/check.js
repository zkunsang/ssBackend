const ReqQuestCheck = require('@ss/models/controller/ReqQuestCheck');

const UserQuestStoryDao = require('@ss/daoMongo/UserQuestStoryDao');
const QuestAcceptLogDao = require('@ss/daoMongo/QuestAcceptLogDao');
const QuestAcceptLog = require('@ss/models/apilog/QuestAcceptLog');

const UserQuestStory = require('@ss/models/mongo/UserQuestStory');
const dbMongo = require('@ss/dbMongo');

const StoryCache = require('@ss/dbCache/StoryCache');
const SSError = require('@ss/error');

module.exports = async (ctx, next) => {
    const reqQuestCheck = new ReqQuestCheck(ctx.request.body);
    ReqQuestCheck.validModel(reqQuestCheck);
    
    const logDate = ctx.$date;
    const userInfo = ctx.$userInfo;

    const uid = userInfo.uid;
    const storyId = reqQuestCheck.getStoryId();
    const questId = reqQuestCheck.getQuestId();

    const storyData = StoryCache.get(storyId);

    if(!storyData) {
        ctx.$res.badRequest(SSError.Service.Code.storyNoExist);
        return;
    }

    // 퀘스트 수락 로그
    const userQuestStoryDao = new UserQuestStoryDao(ctx.$dbMongo);
    const userQuestStory = await userQuestStoryDao.findOne({ storyId, uid });

    let questAccepted = false;
    if(userQuestStory == null) {
        questAccepted = true;
        const questAccept = {};
        questAccept[questId] = logDate;
        await userQuestStoryDao.insertOne(new UserQuestStory({ storyId, uid, questAccept }));
    }
    else {
        let userQuestAccept = userQuestStory.getQuestAccept();
    
        if(userQuestAccept == null || userQuestAccept[questId] == null) {
            questAccepted = true;
            userQuestAccept = userQuestAccept || {};
            userQuestAccept[questId] = logDate;
            const updateObject = {
                questAccept: userQuestAccept
            }
            
            const _id = userQuestStory.getObjectId();
            await userQuestStoryDao.updateOne({ _id }, {...updateObject});
        }
    }
    
    if(questAccepted) {
        const questAcceptLogDao = new QuestAcceptLogDao(dbMongo, logDate);
        await questAcceptLogDao.insertOne(new QuestAcceptLog({uid, storyId, questId, logDate}));
    }

    ctx.$res.success({})

    await next();
}

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/accessory
 * operations:
 *   -  httpMethod: POST
 *      summary: 악세사리 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>sessionId: 세션 아이디
 *        <br>itemId: 아이템 아이디
 *      responseClass: resShopAccessory
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqQuestCheck
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqQuestCheck:
 *     id: reqQuestCheck
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       itemId:
 *         type: String
 *         required: true
 *         description: 아이템 아이디
 *   resShopAccessory:
 *     id: resShopAccessory
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */