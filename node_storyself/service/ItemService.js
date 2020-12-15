const Service = require('../service/Service');
const ItemMaterial = require('../models/mongo/ItemMaterial');

const ItemCache = require('../dbCache/ItemCache');
const ItemMaterialCache = require('../dbCache/ItemMaterialCache');

const SSError = require('../error');

class ItemService extends Service {
    constructor() {
        super();
    }

    getItemList(itemList) {
        Service.Validate.checkEmptyArray(itemList);
        return this.filterItemList(itemList);
    }

    filterItemList(itemList) {
        const notExistItem = [];
        const existItem = [];

        for (const itemId of itemList) {
            const itemData = ItemCache.get(itemId);
            if (!itemData) {
                notExistItem.push(itemId);
            }
            existItem.push(itemData);
        }

        if (notExistItem.length > 0) {
            throw new SSError.Service(SSError.Service.Code.noExistItemList, `[${notExistItem.join(',')}] not exist item`)
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
        for(const inventory of useInventoryList) {
            this.applyCouponInventory(inventory, couponId);
        }
    }

    applyCouponInventory(inventory, couponId) {
        if(couponId === "defaultSale") {
            inventory.setItemQny(parseInt(inventory.getItemQny() * 0.9));
        }
    }
}

module.exports = ItemService;