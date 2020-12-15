const SSError = require('../error');

class Dao {
    constructor() {}
    
    async insertOne(resource) {
        this.constructor.insertValid.call(this, resource);
        await this.collection.insertOne(resource);
    }

    async insertMany(resourceList) {
        this.constructor.insertValidList.call(this, resourceList);
        if(resourceList.length === 0) return;
        await this.collection.insertMany(resourceList);
    }

    async updateOne(where, $set) {
        this.constructor.checkWhere.call(this, where);
        this.constructor.checkSet.call(this, $set);

        const result = await this.collection.updateMany(where, { $set });
        this.constructor.checkUpdateCount.call(this, result.matchedCount, 1, where, $set);
    }

    async updateMany(where, $set, updateCount) {
        this.constructor.checkTestEnv();
        this.constructor.checkWhere.call(this, where);
        this.constructor.checkSet.call(this, $set);

        const result = await this.collection.updateMany(where, { $set });
        this.constructor.checkUpdateCount(this, result.matchedCount, updateCount, where, $set);
    }

    async updateAll($set) {
        this.constructor.checkTestEnv();
        this.constructor.checkSet($set);
        await this.collection.updateMany({}, { $set });
    }

    async findOne(where) {
        this.constructor.checkNotAllowWhereNull.call(this, where);
        this.constructor.checkWhere.call(this, where);

        const result = await this.collection.find(where).toArray();
        if (result.length === 0) return null;
        this.constructor.checkFindCount.call(this, result.length, 1, where);

        return new this.constructor.model(result[0]);
    }

    async findMany(where) {
        this.constructor.checkNotAllowWhereNull.call(this, where);
        this.constructor.checkWhere.call(this, where);
        const findList = await this.collection.find(where).toArray();

        if (findList.length === 0) return findList;
        return this.constructor.mappingList.call(this.constructor, findList);
    }

    async findAll() {
        const findList = await this.collection.find().toArray();
        if (findList.length === 0) return findList;
        return this.constructor.mappingList.call(this.constructor, findList);
    }

    async deleteOne(where) {
        this.constructor.checkWhere.call(this, where);
        const result = await this.collection.deleteMany(where);
        this.constructor.checkDeleteOneCount.call(this, result.deletedCount, where);
    }

    async deleteMany(where, expectCount) {
        this.constructor.checkWhere.call(this, where);
        const result = await this.collection.deleteMany(where);
        if(expectCount)
            this.constructor.checkDeleteCount.call(this, result.deletedCount, expectCount, where);
    }

    async deleteAll() {
        await this.collection.deleteMany();
    }

    static checkValidObj(obj) {
        if (!(obj instanceof this.constructor.model)) {
            throw new SSError.Dao(SSError.Dao.Code.notAllowModel, `${obj.name} is not ${this.constructor.model.name}`)
        }

        this.constructor.model.validModel.call(this.constructor.model, obj);
        this.constructor.model.validValue.call(this.constructor.model, obj);
    }

    static checkInsertField(insertObj) {
        const needList = this.constructor.requireInsertFieldList();
        const requireList = needList.filter((item) => {
            return insertObj[item] === undefined || insertObj[item] === null
        });

        if (requireList.length > 0) {
            throw new SSError.Dao(SSError.Dao.Code.requireInsertField, `${insertObj.name} - ${requireList.join(',')} need required field `)
        }
    }

    static checkAllowWhereField(where) {
        const allowFieldList = this.constructor.allowWhereFieldList();
        if (allowFieldList.length === 0) return;
        if (allowFieldList.reduce((acc, item) =>
            where[item] !== undefined && where[item] !== null ? ++acc : acc, 0) === 0) {
            throw new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
        }
    }

    static checkAllowSetField($set) {
        if (this.constructor.allowSetFieldList().reduce((acc, item) =>
            $set[item] !== undefined && $set[item] !== null ? ++acc : acc, 0) === 0) {
            throw new SSError.Dao(SSError.Dao.Code.noAffectedField);
        }
    }

    static checkNotAllowSetField($set) {
        const notAllowList = this.constructor.notAllowSetFieldList().filter((item) => $set[item]);
        if (notAllowList.length > 0) {
            throw new SSError.Dao(SSError.Dao.Code.notAllowSetField, `${this.constructor.name} - ${notAllowList.join(',')} not allow set field`)
        }
    }

    static checkNotAllowWhereNull(where) {
        if (!where) {
            throw new SSError.Dao(SSError.Dao.Code.whereCantBeNull, `${this.constructor.name} where can't null`);
        }
    }

    static checkNotAllowSetNull($set) {
        if (!$set) {
            throw new SSError.Dao(SSError.Dao.Code.setCantBeNull, `${this.constructor.name} set can't null`);
        }
    }

    static checkUpdateCount(updateCount, expectCount, where, $set) {
        if (updateCount != expectCount) {
            throw new SSError.Dao(SSError.Dao.Code.updateOneCount,
                `${this.name} ${updateCount} expect ${expectCount}
                where: ${where}, set: ${$set}`);
        }
    }

    static checkFindCount(findLength, expectCount, where) {
        if (findLength != expectCount) {
            throw new SSError.Dao(SSError.Dao.Code.getOneLength,
                `${this.name} ${findLength} expect - ${expectCount} where: ${where}`);
        }
    }

    static checkDeleteOneCount(deleteLength, where) {
        if (deleteLength != 1) {
            throw new SSError.Dao(SSError.Dao.Code.deleteOneLength,
                `${this.constructor.name} expect result length 1 - ${deleteLength} where: ${where}`);
        }
    }

    static checkDeleteCount(deleteLength, expectedLength, where) {
        if (deleteLength != expectedLength) {
            throw new SSError.Dao(SSError.Dao.Code.deleteManyLength,
                `${this.constructor.name} expect result length ${expectedLength} - ${deleteLength} where: ${where}`);
        }
    }

    static checkTestEnv() {
        if (!process.env.NODE_ENV.startsWith('test')) {
            throw new SSError.Dao(SSError.Dao.Code.onlyTestFunction);
        }
    }

    static mappingList(list) {
        let result = [];
        for (const item of list) {
            result.push(new this.model(item));
        }

        return result;
    }


    static insertValidList(modelList) {
        for (const model of modelList) {
            this.constructor.insertValid.call(this, model);
        }
    }

    static insertValid(modelObj) {
        this.constructor.checkValidObj.call(this, modelObj);
        this.constructor.checkInsertField.call(this, modelObj);
    }

    static checkWhere(where) {
        this.constructor.checkAllowWhereField.call(this, where);
        this.constructor.model.validValue.call(this.constructor.model, where);
    }

    static checkSet($set) {
        this.constructor.checkNotAllowSetNull.call(this, $set);
        this.constructor.checkAllowSetField.call(this, $set);
        this.constructor.checkNotAllowSetField.call(this, $set);
        this.constructor.model.validValue.call(this.constructor.model, $set);
    }
}

module.exports = Dao;