const Model = require('../../models');
const Inventory = require('../../models/mongo/Inventory');

const ValidateUtil = require('../../util/ValidateUtil')
const ValidType = ValidateUtil.ValidType;

const Schema = {
    STORY_ID: { key: 'storyId', required: true, type: ValidType.STRING },
    QUEST_ID: { key: 'questId', required: true, type: ValidType.NUMBER },
    ITEM_ID: { key: 'itemId', required: true, type: ValidType.STRING },
    ITEM_QNY: { key: 'itemQny', required: true, type: ValidType.NUMBER }
}

class QuestStoryReward extends Model {
    constructor({ storyId, questId, itemId, itemQny }) {
        super();

        this[Schema.STORY_ID.key] = ValidateUtil.setNullUndefined(storyId);
        this[Schema.QUEST_ID.key] = ValidateUtil.setNullUndefined(questId);
        this[Schema.ITEM_ID.key] = ValidateUtil.setNullUndefined(itemId);
        this[Schema.ITEM_QNY.key] = ValidateUtil.setNullUndefined(itemQny);
    }

    makeInventoryObject() {

        let inventoryObj = {}
        inventoryObj[Inventory.Schema.ITEM_ID.key] = this[Schema.ITEM_ID.key];
        inventoryObj[Inventory.Schema.ITEM_QNY.key] = this[Schema.ITEM_QNY.key];

        return new Inventory(inventoryObj);
    }

}

module.exports = QuestStoryReward;
module.exports.Schema = Schema;
