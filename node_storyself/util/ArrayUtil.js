const _ = require('lodash');

class ArrayUtil {
    constructor() { }

    compareArrayByKey(arrayBefore, arrayAfter, key) {
        const mapBefore = _.keyBy(arrayBefore, key);
        const mapAfter = _.keyBy(arrayAfter, key);

        return this.compareArrayByKeyWithMap(mapBefore, mapAfter, arrayBefore, arrayAfter, key)
    }

    compareArrayByKeyWithMap(mapBefore, mapAfter, arrayBefore, arrayAfter, key) {
        const insertList = [];
        const deleteList = [];
        const updateList = [];

        for (const itemAfter of arrayAfter) {
            const item = mapBefore[itemAfter[key]];
            const list = item ? updateList : insertList;
            list.push(itemAfter);
        }

        for (const itemBefore of arrayBefore) {
            const item = mapAfter[itemBefore[key]];
            if (!item) continue;
            deleteList.push(itemBefore);
        }

        return { mapBefore, mapAfter, insertList, deleteList, updateList };
    }

    getArrayValueByKey(array, key) {
        return array.reduce((acc, item) => {
            acc.push(item[key])
            return acc;
        }, []);
    }

    getMapArrayByKey(array, key) {
        let mapObject = {};
        for (const item of array) {
            let list = mapObject[item[key]];
            if (!list) {
                list = [];
                mapObject[item[key]] = list;
            }

            list.push(item);
        }

        return mapObject;
    }

    keyBy(array, key) {
        return _.keyBy(array, key);
    }
}

module.exports = new ArrayUtil();
