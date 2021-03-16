const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Service = require('../service/Service');

const User = require('../models/mongo/User');

const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    USER_DAO: { key: 'userDao', required: true, type: ValidType.OBJECT },

    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    INVENTORY: { key: 'inventory', required: false, type: ValidType.OBJECT },
}


class UserService extends Service {
    /**
     * 
     * @param {*} userInfo 
     * @param {UserDao} userDao 
     * @param {*} updateDate 
     */
    constructor(userInfo, userDao, updateDate) {
        super();

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.USER_DAO.key] = userDao;
        this[Schema.UPDATE_DATE.key] = updateDate;
        
        this.isChange = false;
    }

    setInventory(inventory) {
        this.isChange = true;
        this[Schema.USER_INFO.key][Schema.INVENTORY.key] = inventory;
    }

    async finalize() {
        if(!this.isChange) return false;
        
        const copyUserInfo = Object.assign({ ...this[Schema.USER_INFO.key] });

        const { uid } = copyUserInfo;

        delete copyUserInfo.uid;
        delete copyUserInfo.email;
        delete copyUserInfo.createDate;

        await this[Schema.USER_DAO.key].updateOne({ uid }, copyUserInfo); 
    }
}

module.exports = UserService;
module.exports.Schema = Schema;
