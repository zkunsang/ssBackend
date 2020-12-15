const moment = require('moment');
const SSError = require('../error');

const NullAllow = {
    YES: true,
    NO: false
}

const Type = {
    STRING: 'string',
    NUMBER: 'number'
};

const ValidType = {
    STRING: 'string',
    NUMBER: 'number',
    UNIX_TIMESTAMP: 'unixTimeStamp',
    EMAIL: 'email',
    ARRAY: 'Array',
    OBJECT: 'Object',
}

const UserStatus = {
    NONE: 1,
    ADMIN: 2,
    BLOCK: 3,
}

const Provider = {
    GOOGLE: 'google',
    APPLE: 'apple',
    FACEBOOK: 'facebook',
    EMAIL: 'email',
    ETC: 'etc',
}

const Platform = {
    IOS: 'ios',
    AOS: 'aos'
}

const AppStore = {
    GOOGLE: 'google',
    ONESTORE: 'onestore',
    APPLE: 'apple',
}

const StoryStatus = {
    ACTIVATE: 1,
    DEACTIVATE: 0
}

const AdminRole = {
    ADMINISTRATOR: 'admin',
    GRAPHER: 'grapher',
    DEVELOPER: 'developer',
    NONE: 'none'
}

const AdminStatus = {
    PENDING: 1,
    ACTIVATE: 2,
    DEACTIVATE: 3,
}

const CommonBoolean = {
    TRUE: 1,
    FALSE: 0
}

const PurchaseStatus = {
    SUCCESS: 0,
    FAIL: 1
}

const IpManageType = {
    BLACK: 'black',
    WHITE: 'white'
}

class ValidateUtil {
    constructor() {
        this.validFunc = {};
        this.validFunc[ValidType.STRING] = this.validString;
        this.validFunc[ValidType.NUMBER] = this.validNumber;
        this.validFunc[ValidType.EMAIL] = this.validEmail;
        this.validFunc[ValidType.UNIX_TIMESTAMP] = this.validUnixTimeStamp;
        this.validFunc[ValidType.ARRAY] = this.validArray;
        this.validFunc[ValidType.OBJECT] = this.validObject;
    }

    valid(model, schema, obj, nullable) {
        const schemaKeys = Object.keys(schema);

        for (const schemaKey of schemaKeys) {
            const field = schema[schemaKey].key;
            const required = schema[schemaKey].required;
            const type = schema[schemaKey].type;
            const validRange = schema[schemaKey].validRange;
            const validObject = schema[schemaKey].validObject;
            const item = obj[field];

            this.validFunc[type].call(this, model, field, item, nullable ? true : !required, validRange || validObject);
        }
    }

    validEmail(model, field, item, nullable) {
        if (this._checkIsNull(model, field, item, nullable)) {
            return;
        }

        this._checkType(model, field, item, Type.STRING);
        this._checkValidEmail(model, field, item);
    }

    validString(model, field, item, nullable, validRange) {
        if (this._checkIsNull(model, field, item, nullable)) {
            return;
        }

        this._checkType(model, field, item, Type.STRING);
        this._checkRange(model, field, item, validRange);
    }

    validNumber(model, field, item, nullable, validRange) {
        if (this._checkIsNull(model, field, item, nullable)) {
            return;
        }

        this._checkType(model, field, item, Type.NUMBER);
        this._checkRange(model, field, item, validRange);
    }

    validUnixTimeStamp(model, field, item, nullable) {
        if (this._checkIsNull(model, field, item, nullable)) {
            return;
        }

        this._checkType(model, field, item, Type.NUMBER);
        this._checkValidUnixTimestamp(model, field, item);
    }

    validArray(model, field, item, nullable) {
        if (this._checkIsNull(model, field, item, nullable)) {
            return;
        }
        this._checkArrayType(model, field, item);
    }

    validObject(model, field, item, nullable, validObject) {
        if (this._checkIsNull(model, field, item, nullable)) {
            return;
        }
        this._checkObjectType(model, field, item, validObject);
    }


    _checkIsNull(model, field, item, nullable) {
        if (nullable) return item === undefined || item === null;

        if (item === undefined || item === null) {
            throw new SSError.Model(SSError.Model.Code.requiredField, `${model.name} - [${field}] can't be null`);
        }

        return false;
    }

    _checkType(model, field, item, type) {
        if (typeof item !== type) {
            throw new SSError.Model(SSError.Model.Code.checkType, `${model.name} - [${field}] is ${type}`);
        }
    }

    _checkArrayType(model, field, item) {
        if (!(item instanceof Array)) {
            throw new SSError.Model(SSError.Model.Code.checkType, `${model.name} - [${field}] is Array`);
        }
    }

    _checkObjectType(model, field, item, validObject) {
        if (!validObject) {
            validObject = Object;
        }

        if (!(item instanceof validObject)) {
            throw new SSError.Model(SSError.Model.Code.checkType, `${model.name} - [${field}] is ${item.constructor.name}`);
        }
    }

    _checkValidEmail(model, field, item) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const result = re.test(String(item).toLowerCase())

        if (!result) {
            throw new SSError.Model(SSError.Model.Code.notValidEmail, `${model.name} - [${field}] invalid email address`)
        }
    }

    _checkValidUnixTimestamp(model, field, item) {
        try {
            moment().unix(item);
        }
        catch (err) {
            throw new SSError.Model(SSError.Model.Code.notValidUnixTimeStamp, `${model.name} - [${field}] invalid timestamp`);
        }
    }

    _checkRange(model, field, item, validRange) {
        if (!validRange) return;
        if (!(validRange instanceof Array)) {
            throw new SSError.Model(SSError.Model.Code.validRangeType, `${model.name} - [${field}] check validRange type`);
        }

        if (!validRange.includes(item)) {
            throw new SSError.Model(SSError.Model.Code.validRangeValue, `${model.name} - [${field}] check validRange value`);
        }
    }

    setNullUndefined(item) {
        if(item === 0) return item;
        return item || undefined;
    }
}

module.exports = new ValidateUtil();
module.exports.NullAllow = NullAllow;
module.exports.ValidType = ValidType;
module.exports.UserStatus = UserStatus;
module.exports.Provider = Provider;
module.exports.Platform = Platform;
module.exports.AppStore = AppStore;
module.exports.StoryStatus = StoryStatus;
module.exports.AdminRole = AdminRole;
module.exports.AdminStatus = AdminStatus;
module.exports.CommonBoolean = CommonBoolean;
module.exports.PurchaseStatus = PurchaseStatus;
module.exports.IpManageType = IpManageType;

