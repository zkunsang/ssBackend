const dbMongo = require('../dbMongo');
const QuestStoryDao = require('../daoMongo/QuestStoryDao');
const QuestStoryGoalDao = require('../daoMongo/QuestStoryGoalDao');
const QuestStoryRewardDao = require('../daoMongo/QuestStoryRewardDao');

const Cache = require('./Cache');
const _ = require('lodash');
const ArrayUtil = require('@ss/util/ArrayUtil');

const tableId = 'questStory';

class QuestStoryCacheModel {
    constructor() {
        this.questStoryList = null;
        this.questStoryRewardList = null;
        this.questStoryGoalList = null;

        this.questStoryGoalMap = null;
        this.questStoryRewardMap = null;
        this.questStoryMap = null;
    }

    async loadData({ questStoryDao, questStoryGoalDao, questStoryRewardDao }) {
        this.questStoryList = await questStoryDao.findAll();
        this.questStoryGoalList = await questStoryGoalDao.findAll();
        this.questStoryRewardList = await questStoryRewardDao.findAll();

        this.questStoryMap = ArrayUtil.getMapArrayByKey(this.questStoryList, "storyId");
        this.questStoryGoalMap = ArrayUtil.getMapArrayByKey(this.questStoryGoalList, "storyId");
        this.questStoryRewardMap = ArrayUtil.getMapArrayByKey(this.questStoryRewardList, "storyId");

        const storyList = Array.from(new Set(this.questStoryList.map((item) => item.storyId)));

        for (const storyId of storyList) {
            const questStoryList = this.questStoryMap[storyId];
            const questStoryGoalList = this.questStoryGoalMap[storyId];
            const questStoryRewardList = this.questStoryRewardMap[storyId];

            this.questStoryMap[storyId].questMap = ArrayUtil.keyBy(questStoryList, "questId");

            // 퀘스트 목적 퀘스트 아이디로
            this.questStoryMap[storyId].questGoalMap = ArrayUtil.getMapArrayByKey(questStoryGoalList, "questId");

            // 퀘스트 보상 퀘스트 아이디로
            this.questStoryMap[storyId].questRewardMap = ArrayUtil.getMapArrayByKey(questStoryRewardList, "questId");

            // 타겟으로 퀘스트 리스트 받아옴
            this.questStoryMap[storyId].questTargetMap = ArrayUtil.getMapArrayByKey(questStoryGoalList, "actionId");
        }
    }

    getQuestListByStoryId(storyId) {
        return this.questStoryMap[storyId];
    }

    getQuestInfo(storyId, questId) {
        return this.questStoryMap[storyId].questMap[questId];
    }

    getQuestListByTargetId(storyId, actionId) {
        if (!this.questStoryMap[storyId])
            return null;

        return this.questStoryMap[storyId].questTargetMap[actionId];
    }

    getQuestRewardList(storyId, questId) {
        if (!this.questStoryMap[storyId])
            return null;

        return this.questStoryMap[storyId].questRewardMap[questId];
    }

    getQuestGoalList(storyId, questId) {
        if (!this.questStoryMap[storyId])
            return null;

        return this.questStoryMap[storyId].questGoalMap[questId];
    }
}

class QuestStoryCache extends Cache {
    constructor() {
        super();
        this.cacheModel = QuestStoryCacheModel;
        this.tableId = tableId;
    }

    async ready() {
        const questStoryDao = new QuestStoryDao(dbMongo);
        const questStoryGoalDao = new QuestStoryGoalDao(dbMongo);
        const questStoryRewardDao = new QuestStoryRewardDao(dbMongo);

        this.dao = { questStoryDao, questStoryGoalDao, questStoryRewardDao };
    }

    getQuestListByStoryId(storyId) {
        return this.currentCacheModel.getQuestListByStoryId(storyId);
    }

    getQuestListByTargetId(storyId, actionId) {
        return this.currentCacheModel.getQuestListByTargetId(storyId, actionId);
    }

    getQuestRewardList(storyId, questId) {
        return this.currentCacheModel.getQuestRewardList(storyId, questId);
    }

    getQuestGoalList(storyId, questId) {
        return this.currentCacheModel.getQuestGoalList(storyId, questId);
    }

    getQuestInfo(storyId, questId) {
        return this.currentCacheModel.getQuestInfo(storyId, questId);
    }
}

module.exports = new QuestStoryCache();