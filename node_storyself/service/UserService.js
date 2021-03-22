const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Service = require('../service/Service');
const dbMongo = require('../dbMongo');

const User = require('../models/mongo/User');
const UserDao = require('../daoMongo/UserDao');


const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    USER_DAO: { key: 'userDao', required: true, type: ValidType.OBJECT },
    NEW_USER: { key: 'newUser', required: false, type: ValidType.BOOLEAN },
    CHANGE: { key: 'change', required: false, type: ValidType.BOOLEAN },

    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    INVENTORY: { key: 'inventory', required: false, type: ValidType.ARRAY },
    MAIL: { key: 'mail', required: false, type: ValidType },
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

        // userDao는 context의 첫부분에서 항상 만든다.
        // 그래서 인자로 userDao를 넣는다
        if(!userDao) {
            userDao = new UserDao(dbMongo);
        }

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.USER_DAO.key] = userDao;
        this[Schema.UPDATE_DATE.key] = updateDate;
        this[Schema.NEW_USER.key] = false;
        this[Schema.CHANGE.key] = false;
    }

    
    async findUser(provider, providerId) {
        const providerInfo = {}
        providerInfo[provider] = providerId;

        const userInfo = this[Schema.USER_DAO.key].findOne(providerInfo);
        return userInfo;
    }

    setInventory(inventory) {
        this.setChange();
        this[Schema.USER_INFO.key][Schema.INVENTORY.key] = inventory;
    }

    setMail(mail) {
        this.setChange();
        this[Schema.USER_INFO.key][Schema.MAIL.key] = mail;
    }

    setUserInfo(userInfo) {
        this.setChange();
        this.setIsNewUser();

        this[Schema.USER_INFO.key] = userInfo;
    }

    setIsNewUser() {
        this[Schema.NEW_USER.key] = true;
    }

    setChange() {
        this[Schema.CHANGE.key] = true;
    }

    isChange() {
        return this[Schema.CHANGE.key];
    }

    isNewUser() {
        return this[Schema.NEW_USER.key];
    }

    async finalize() {
        if(!this.isChange()) return false;

        if(!this.isNewUser()) {
            const copyUserInfo = Object.assign({ ...this[Schema.USER_INFO.key] });
            const { uid } = copyUserInfo;

            delete copyUserInfo.uid;
            delete copyUserInfo.email;
            delete copyUserInfo.createDate;

            await this[Schema.USER_DAO.key].updateOne({ uid }, copyUserInfo); 
        } else {

        }
        
    }

    
}

module.exports = UserService;
module.exports.Schema = Schema;
