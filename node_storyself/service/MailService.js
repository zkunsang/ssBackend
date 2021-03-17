const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;
const MailStatus = ValidateUtil.MailStatus;
const shortid = require('shortid');

const Service = require('../service/Service');
const SSError = require('@ss/error');


const User = require('../models/mongo/User');
const Mail = require('../models/mongo/Mail');

const MailSendLog = require('../models/apilog/MailSendLog');
const MailReadLog = require('../models/apilog/MailReadLog');
const MailDelLog = require('../models/apilog/MailDelLog');

const MailSendLogDao = require('../daoMongo/MailSendLogDao');
const MailReadLogDao = require('../daoMongo/MailReadLogDao');
const MailDelLogDao = require('../daoMongo/MailDelLogDao');

const dbMongo = require('../dbMongo');

const Schema = {
    USER_INFO: { key: 'userInfo', required: true, type: ValidType.OBJECT, validObject: User },
    UID: { key: 'uid', required: true, type: ValidType.STRING },
    MAIL: { key: 'mail', required: false, type: ValidType.OBJECT },

    UPDATE_DATE: { key: 'updateDate', required: false, type: ValidType.UNIX_TIMESTAMP },
    SEND_LOG: { key: 'sendLog', required: false, type: ValidType.ARRAY },
    READ_LOG: { key: 'readLog', required: false, type: ValidType.ARRAY },
    DEL_LOG: { key: 'delLog', required: false, type: ValidType.ARRAY }
}


class MailService extends Service {
    /**
     * 
     * @param {*} userInfo 
     * @param {MailLogDao} mailLogDao
     * @param {*} updateDate 
     */
    constructor(userInfo, updateDate) {
        super();

        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UPDATE_DATE.key] = updateDate;

        const { uid, mail } = userInfo;

        this[Schema.UID.key] = uid;
        this[Schema.MAIL.key] = mail || {};

        this[Schema.SEND_LOG.key] = [];
        this[Schema.READ_LOG.key] = [];
        this[Schema.DEL_LOG.key] = [];
    }

    getUID() {
        return this[Schema.UID.key];
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getMail() {
        return this[Schema.MAIL.key];
    }

    getDelLog() {
        return this[Schema.DEL_LOG.key]
    }

    getReadLog() {
        return this[Schema.READ_LOG.key];
    }

    getSendLog() {
        return this[Schema.SEND_LOG.key];
    }

    pushSendLog(sendLog) {
        this[Schema.SEND_LOG.key].push(sendLog);
    }

    pushReadLog(readLog) {
        this[Schema.READ_LOG.key].push(readLog);
    }

    pushDelLog(delLog) {
        this[Schema.DEL_LOG.key].push(delLog);
    }

    sendMail({ title, message, sender, itemList, itemInfo }) {
        const uid = this.getUID();
        const mailId = shortid.generate();
        const date = this.getUpdateDate();
        const status = MailStatus.SEND;

        const newMail = new Mail({ mailId, title, message, sender, status, itemList, itemInfo });
        const mailSendLog = new MailSendLog({ uid, date, ...newMail });
        this.pushSendLog(mailSendLog);

        const userMail = this.getMail();
        userMail[mailId] = newMail;
        
        return userMail;
    }

    readMail(mailId) {
        const userMail = this.getMail();
        const uid = this.getUID();
        const date = this.getUpdateDate();

        if(!userMail[mailId]) {
            this.throwNoExitMail(uid, mailId);
        }

        // 아이템 처리
        const { itemList, itemInfo } = userMail[mailId];

        // 읽기 처리
        userMail[mailId].status = MailStatus.READ;
        const mailReadLog = new MailReadLog({ uid, date, mailId });
        this.pushReadLog(mailReadLog);
        
        return { userMail, itemList, itemInfo };
    }

    delMail(mailId, delId) {
        const userMail = this.getMail();
        const uid = this.getUID();
        const date = this.getUpdateDate();

        if(!userMail[mailId]) {
            this.throwNoExitMail(uid, mailId);
        }
        
        userMail[mailId].status = MailStatus.DELETE;

        const mailDelLog = new MailDelLog({uid, date, delId, status: MailStatus.DELETE, mailId })
        this.pushDelLog(mailDelLog);

        delete userMail[mailId];
        return userMail;
    }

    finalize() {
        this.logRead();
        this.logSend();
        this.logDel();
    }

    logRead() {
        const readLog = this.getReadLog();
        if(readLog.length <= 0) return;

        
        const mailReadLogDao = new MailReadLogDao(dbMongo, this.getUpdateDate());
        mailReadLogDao.insertMany(readLog);
    }

    logSend() {
        const sendLog = this.getSendLog();
        if(sendLog.length <= 0) return;

        const mailSendLogDao = new MailSendLogDao(dbMongo, this.getUpdateDate());
        mailSendLogDao.insertMany(sendLog);
    }

    logDel() {
        const delLog = this.getDelLog();
        if(delLog.length <= 0) return;

        const mailDelLogDao = new MailDelLogDao(dbMongo, this.getUpdateDate());
        mailDelLogDao.insertMany(delLog);
    }

    throwNoExitMail(uid, mailId) {
        throw new SSError.Service(
            SSError.Service.Code.noExistMail,
            `${uid} - ${mailId}`);
    }
    
}
module.exports = MailService;
module.exports.Schema = Schema;