const ValidateUtil = require('../util/ValidateUtil');
const ValidType = ValidateUtil.ValidType;

const Service = require('../service/Service');
const SSError = require('../error');

const User = require('../models/mongo/User');

const VoiceLogDao = require('../daoMongo/VoiceLogDao');
const VoiceLog = require('../models/apilog/VoiceLog');

const PictureLogDao = require('../daoMongo/PictureLogDao');
const PictureLog = require('../models/apilog/PictureLog');

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


class LogService extends Service {
    /**
     * 
     * @param {*} userInfo 
     * @param {MailLogDao} mailLogDao
     * @param {*} updateDate 
     */
    constructor(userInfo, updateDate) {
        super();

        const { uid } = userInfo;
        this[Schema.UID.key] = uid;
        this[Schema.USER_INFO.key] = userInfo;
        this[Schema.UPDATE_DATE.key] = updateDate;
    }

    getUpdateDate() {
        return this[Schema.UPDATE_DATE.key];
    }

    getUID() {
        return this[Schema.UID.key];
    }

    sendVoiceLog({ storyId, soundIndex, sceneIndex, length }) {
        const uid = this.getUID();
        const logDate = this.getUpdateDate();

        const voiceLogDao = new VoiceLogDao(dbMongo, logDate);
        voiceLogDao.insertOne(new VoiceLog({ uid, logDate, storyId, soundIndex, sceneIndex, length }));
    }

    sendPictureLog({ success, debugLog, location, errCode }) {
        const uid = this.getUID();
        const logDate = this.getUpdateDate();

        const pictureLogDao = new PictureLogDao(dbMongo, logDate);
        pictureLogDao.insertOne(new PictureLog({ uid, success, debugLog, errCode, logDate, location }));
    }



    throwNoExitMail(uid, mailId) {
        throw new SSError.Service(
            SSError.Service.Code.noExistMail,
            `${uid} - ${mailId}`);
    }
}
module.exports = LogService;
module.exports.Schema = Schema;