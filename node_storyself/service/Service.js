const SSError = require('../error');
const ValidateUtil = require('../util/ValidateUtil')
const NullAllow = ValidateUtil.NullAllow;

class Service {
    constructor() { }
    static validModel(obj) {
        this._validCommon.call(this, obj, NullAllow.NO);
    }

    static validValue(obj) {
        this._validCommon.call(this, obj, NullAllow.YES);
    }

    static _validCommon(obj, nullable) {
        ValidateUtil.valid(this, this.Schema, obj, nullable);
    }
}

class Validate {
    constructor() { }
    static checkIsNull(obj) {
        if (obj === null || obj === undefined) {
            throw new SSError.Service(SSError.Service.Code.isNull);
        }
    }

    static checkArray(obj) {
        if (!(obj instanceof Array)) {
            throw new SSError.Service(SSError.Service.Code.notArray);
        }
    }

    static checkEmptyArray(obj) {
        Validate.checkArray(obj);
        if(!obj.length) {
            throw new SSError.Service(SSError.Service.Code.emptyArray);
        }
    }

    static checkArrayObject(obj, objectType) {
        Validate.checkEmptyArray(obj);
        obj.map((item) => {
            if (!(item instanceof objectType)) {
                throw new SSError.Service(SSError.Service.Code.wrongArrayObject, `need ${objectType.name} array`);
            }
        })
    }
}

module.exports = Service;
module.exports.Validate = Validate;