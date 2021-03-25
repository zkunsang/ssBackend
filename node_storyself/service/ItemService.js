const Service = require('../service/Service');
const ItemMaterial = require('../models/mongo/ItemMaterial');

const ItemCache = require('../dbCache/ItemCache');
const ItemMaterialCache = require('../dbCache/ItemMaterialCache');

const SSError = require('../error');
const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const User = require('../models/mongo/User');

const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    UID: { key: 'uid', required: false, type: ValidType.STRING },
}

class ItemService extends Service {
    constructor(userInfo) {
        super();

        const { uid } = userInfo;
        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UID.key] = uid;
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getItemList(itemList) {
        Service.Validate.checkEmptyArray(itemList);
        return this.filterItemList(itemList);
    }

    filterItemList(itemList) {
        const noExistItem = [];
        const existItem = [];

        for (const itemId of itemList) {
            const itemData = ItemCache.get(itemId);
            if (!itemData) {
                noExistItem.push(itemId);
            }
            existItem.push(itemData);
        }

        if (noExistItem.length > 0) {
            this.throwNoExistItemList(noExistItem);
        }

        return existItem;
    }


    _getMaterialList(putInventoryList) {
        const materialList = [];
        for (const inventory of putInventoryList) {
            materialList.push(...ItemMaterialCache.getListByItemId(inventory.getItemId()));
        }

        return materialList;
    }

    getMaterialInventoryList(putInventoryList) {
        const materialList = this._getMaterialList(putInventoryList);
        return ItemMaterial.makeInvetoryObjectList(materialList);
    }

    getExchangeInventoryInfo(inventoryList) {
        const putInventoryList = inventoryList;
        const useInventoryList = this.getMaterialInventoryList(inventoryList);

        return { useInventoryList, putInventoryList }
    }

    applyCoupon(useInventoryList, couponId) {
        for (const inventory of useInventoryList) {
            this.applyCouponInventory(inventory, couponId);
        }
    }

    applyCouponInventory(inventory, couponId) {
        // TODO: 할인 쿠폰
        if (couponId === "defaultSale") {
            inventory.setItemQny(parseInt(inventory.getItemQny() * 0.9));
        }
    }

    checkPurchaseItem(itemId) {
        const itemInfo = ItemCache.get(itemId);

        if (!itemInfo) {
            this.throwNoExistItem(itemId);
            return;
        }

        // 구매 가능한 상태가 아니면 에러 
        if (itemInfo.status !== 1) {
            this.throwPurchaseImpossible(itemId);
            return;
        }
    }

    checkPurchaseItemList(itemList) {
        itemList.map((item) => this.checkPurchaseItem(item));
    }


    throwNoExistItem(itemId) {
        const uid = this.getUID();
        throw new SSError.Service(
            SSError.Service.Code.noExistItemList,
            `[${uid}]: itemId(${itemId})`);
    }

    throwNoExistItemList(noExistItem) {
        const uid = this.getUID();
        throw new SSError.Service(
            SSError.Service.Code.noExistItemList,
            `[${uid}] - [${noExistItem.join(',')}] not exist item`)
    }

    throwPurchaseImpossible(itemId) {
        const uid = this.getUID();
        throw new SSError.Service(
            SSError.Service.Code.purchaseNotPossible,
            `[${uid}]: itemId(${itemId})`);
    }


}

module.exports = ItemService;