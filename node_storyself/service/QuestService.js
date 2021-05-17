const dbMongo = require('../dbMongo');

const Service = require('../service/Service');

const UserQuestStoryDao = require('../daoMongo/UserQuestStoryDao');
const QuestAcceptLogDao = require('../daoMongo/QuestAcceptLogDao');

const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const UserQuestStory = require('../models/mongo/UserQuestStory');
const QuestAcceptLog = require('../models/apilog/QuestAcceptLog');

const SSError = require('../error');
const ActionLog = require('../models/apilog/ActionLog');
const ActionLogDao = require('../daoMongo/ActionLogDao');
const QuestCompleteLog = require('../models/apilog/QuestCompleteLog');

const InventoryService = require('../service/InventoryService');

const QuestStoryCache = require('../dbCache/QuestStoryCache');

const Schema = {
    USER_QUEST_STORY_DAO: { key: 'userQuestStoryDao', required: true, type: ValidType.OBJECT },
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT },
    UPDATE_DATE: { key: 'updateDate', required: true, type: ValidType.UNIX_TIMESTAMP },

    ACCEPT_INSERT_LIST: { key: 'acceptInsertList', required: true, type: ValidType.ARRAY },
    ACCEPT_UPDATE_LIST: { key: 'acceptUpdateList', required: true, type: ValidType.ARRAY },

    ACCEPT_LOG_LIST: { key: 'acceptLogList', required: true, type: ValidType.ARRAY },
    QUEST_ACTION_LOG_LIST: { key: 'questActionLogList', required: false, type: ValidType.Array },
    QUEST_COMPLETE_LOG_LIST: { key: 'questCompleteLogList', required: false, type: ValidType.ARRAY }
}

class QuestService extends Service {
    constructor(userInfo, updateDate) {
        super();

        this[Schema.USER_QUEST_STORY_DAO.key] = new UserQuestStoryDao(dbMongo);
        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UPDATE_DATE.key] = updateDate;

        this[Schema.ACCEPT_INSERT_LIST.key] = [];
        this[Schema.ACCEPT_UPDATE_LIST.key] = [];

        this[Schema.ACCEPT_LOG_LIST.key] = [];

        this[Schema.QUEST_ACTION_LOG_LIST.key] = [];
        this[Schema.QUEST_COMPLETE_LOG_LIST.key] = [];
    }

    getUID() {
        return this[Schema.USER_INFO.key]["uid"];
    }

    getUserQuestStoryDao() {
        return this[Schema.USER_QUEST_STORY_DAO.key];
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getAcceptInsertList() {
        return this[Schema.ACCEPT_INSERT_LIST.key];
    }

    getAcceptUpdateList() {
        return this[Schema.ACCEPT_UPDATE_LIST.key];
    }

    getAcceptLogList() {
        return this[Schema.ACCEPT_LOG_LIST.key];
    }

    getActionLogList() {
        return this[Schema.QUEST_ACTION_LOG_LIST.key];
    }

    getCompleteLogList() {
        return this[Schema.QUEST_COMPLETE_LOG_LIST.key];
    }

    pushAcceptInsertList(item) {
        this.getAcceptInsertList().push(item);
    }

    pushAcceptUpdateList(item) {
        this.getAcceptUpdateList().push(item);
    }

    pushAcceptLogList(item) {
        this.getAcceptLogList().push(item);
    }

    pushActionLog(item) {
        if (Array.isArray(item)) {
            this.getActionLogList().push(...item);
            return;
        }

        this.getActionLogList().push(item);
    }

    pushCompleteLog(item) {
        if (Array.isArray(item)) {
            this.getCompleteLogList().push(...item);
            return;
        }
    }

    async acceptQuest(storyId, questId) {
        // 퀘스트 수락 로그
        const uid = this.getUID();
        const logDate = this.getUpdateDate();
        const questData = QuestStoryCache.getQuestInfo(storyId, questId);

        if (!questData) {
            this.throwNoExistQuest(uid, storyId, questId);
        }

        const userQuestStory = await this.getUserQuestStoryDao().findOne({ storyId, uid });

        let questAccepted = false;

        if (userQuestStory == null) {
            questAccepted = true;
            const questAccept = {};
            questAccept[questId] = logDate;
            this.pushAcceptInsertList(new UserQuestStory({ storyId, uid, questAccept }));

        }
        else {
            let userQuestAccept = userQuestStory.getQuestAccept();

            if (userQuestAccept == null || userQuestAccept[questId] == null) {
                questAccepted = true;
                userQuestAccept = userQuestAccept || {};
                userQuestAccept[questId] = logDate;
                const updateObject = {
                    questAccept: userQuestAccept
                }

                const _id = userQuestStory.getObjectId();
                const where = { _id };
                const set = { ...updateObject };
                this.pushAcceptUpdateList({ where, set });
            }
        }

        if (questAccepted) {
            this.pushAcceptLogList(new QuestAcceptLog({ uid, storyId, questId, logDate }));

        }
    }

    createActionLog(actionList, logDate) {
        const retActionList = [];

        for (const action of actionList) {
            retActionList.push(new ActionLog({ uid, storyId, ...action, logDate }));
        }

        return retActionList;
    }

    async checkUserAction(storyId, actionList) {
        const logDate = this.getUpdateDate();
        const uid = this.getUID();
        const userQuestStoryDao = this.getUserQuestStoryDao();

        this.pushActionLog(actionList.map((item) => new ActionLog({ uid, storyId, ...item, logDate })));

        const questSet = new Set();

        const userNewActionMap = {};

        for (const action of actionList) {
            if (!userNewActionMap[action.actionId]) {
                const _questList = QuestStoryCache.getQuestListByTargetId(storyId, action.actionId);
                if (!_questList)
                    continue;

                _questList.map((quest) => questSet.add(quest.questId));

                userNewActionMap[action.actionId] = 0;
            }

            userNewActionMap[action.actionId] += 1;
        }

        const questList = Array.from(questSet);

        // 1. 유저가 해당 퀘스트를 클리어했는지를 검사
        const userQuestStory = await userQuestStoryDao.findOne({ storyId, uid });

        const userClearQuest = userQuestStory ? userQuestStory.getQuestClear() : {};
        const userStoryAction = userQuestStory ? userQuestStory.getStoryAction() : {};
        const userQuestAccept = userQuestStory ? userQuestStory.getQuestAccept() : {};

        const newClearQuest = [];
        const completeLogList = [];

        for (const questId of questList) {
            const goalList = QuestStoryCache.getQuestGoalList(storyId, questId);

            let isClear = true;

            for (const goal of goalList) {
                // 전부다 했는지 확인
                // 유저가 골에 대한 액션 카운트를 가지고 있는지 확인
                let userCount = userStoryAction[goal.actionId] ? userStoryAction[goal.actionId] : 0;

                if (userNewActionMap[goal.actionId]) {
                    userCount += userNewActionMap[goal.actionId];
                }

                if (goal.count > userCount) isClear = false;

                if (userCount != 0) {
                    userStoryAction[goal.actionId] = userCount;
                }
            }

            // 유저가 이미 획득한 퀘스트면 패스
            if (userClearQuest[questId]) continue;

            if (isClear) {
                userClearQuest[questId] = logDate;
                const completeType = userQuestAccept[questId] ? 1 : 0;
                const acceptDate = userQuestAccept[questId] ? userQuestAccept[questId] : 0;

                completeLogList.push({ uid, storyId, questId, completeType, acceptDate, logDate });

                newClearQuest.push(questId);
            }
        }

        const updateObject = {
            questClear: userClearQuest,
            storyAction: userStoryAction
        }

        const clearQuest = [];
        const putInvenRewardList = [];

        for (const questId of newClearQuest) {
            const rewardList = QuestStoryCache.getQuestRewardList(storyId, questId);
            clearQuest.push({ questId, rewardList });

            // TODO: clearQuest
            // ctx.$res.addData({ clearQuest });
            const itemList = rewardList.map(item => item.makeInventoryObject());

            const addInfo = { questId, questSID: storyId };
            const action = InventoryService.PUT_ACTION.STORY_QUEST;

            putInvenRewardList.push({ addInfo, action, itemList });
        }

        if (userQuestStory) {
            const _id = userQuestStory._id;
            await userQuestStoryDao.updateOne({ _id }, updateObject);
        }
        else {
            await userQuestStoryDao.insertOne(new UserQuestStory({ storyId, uid, ...updateObject }));
        }

        if (completeLogList.length > 0) {
            this.pushCompleteLog(completeLogList.map((item) => new QuestCompleteLog({ ...item })));
        }

        return { clearQuest, rewardList: putInvenRewardList };
    }

    async finalize() {
        const logDate = this.getUpdateDate();
        const acceptInsertList = this.getAcceptInsertList();
        if (acceptInsertList.length > 0) {
            for (const item of acceptInsertList) {
                await this.getUserQuestStoryDao().insertOne(item);
            }
        }

        const acceptUpdateList = this.getAcceptUpdateList();
        if (acceptUpdateList.length > 0) {
            for (const item of acceptUpdateList) {
                const { where, set } = item;
                await this.getUserQuestStoryDao().updateOne(where, set);
            }
        }

        const acceptLogList = this.getAcceptLogList();
        if (acceptLogList.length > 0) {
            const questAcceptLogDao = new QuestAcceptLogDao(dbMongo, logDate);

            for (const item of acceptLogList) {
                questAcceptLogDao.insertOne(item);
            }
        }

        const actionLogList = this.getActionLogList();
        if (actionLogList.length > 0) {
            const actionLogDao = new ActionLogDao(dbMongo, logDate);
            actionLogDao.insertMany(actionLogList);
        }

        const completeLogList = this.getCompleteLogList();
        if (completeLogList.length > 0) {
            const questCompleteLogDao = new QuestCompleteLogDao(dbMongo, logDate);
            questCompleteLogDao.insertMany(completeLogList);
        }
    }

    throwNoExistQuest(uid, storyId, questId) {
        throw new SSError.Service(
            SSError.Service.Code.noExistStoryQuest,
            `[${uid}] ${storyId}, ${questId}`);
    }
}

module.exports = QuestService;