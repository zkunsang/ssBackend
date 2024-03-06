const ValidateUtil = require("../util/ValidateUtil");
const ValidType = ValidateUtil.ValidType;

const Service = require("../service/Service");
const SSError = require("../error");

const User = require("../models/mongo/User");

const VoiceLogDao = require("../daoMongo/log/VoiceLogDao");
const VoiceLog = require("../models/apilog/VoiceLog");

const PictureLogDao = require("../daoMongo/log/PictureLogDao");
const PictureLog = require("../models/apilog/PictureLog");

const PreviewLogDao = require("../daoMongo/log/PreviewLogDao");
const PreviewLog = require("../models/apilog/PreviewLog");

const FeedbackLogDao = require("../daoMongo/log/FeedbackLogDao");
const FeedbackLog = require("../models/apilog/FeedbackLog");

const SceneLogDao = require("../daoMongo/log/SceneLogDao");
const SceneLog = require("../models/apilog/SceneLog");

const UILogDao = require("../daoMongo/log/UILogDao");
const UILog = require("../models/apilog/UILog");

const StreamingLogDao = require("../daoMongo/log/StreamingLogDao");
const StreamingLog = require("../models/apilog/StreamingLog");

const CustomStickerLogDao = require("../daoMongo/log/CustomStickerLogDao");
const CustomStickerLog = require("../models/apilog/CustomStickerLog");

const UserDeleteLogDao = require('../daoMongo/log/UserDeleteLogDao');
const UserDeleteLog = require('../models/apilog/UserDeleteLog');

const dbMongo = require("../dbMongo");
const AIStickerLogDao = require("@ss/daoMongo/log/AIStickerLogDao");
const AIStickerLog = require("@ss/models/apilog/AIStickerLog");


const Schema = {
  USER_INFO: {
    key: "userInfo",
    required: true,
    type: ValidType.OBJECT,
    validObject: User,
  },
  UID: { key: "uid", required: true, type: ValidType.STRING },
  MAIL: { key: "mail", required: false, type: ValidType.OBJECT },

  UPDATE_DATE: {
    key: "updateDate",
    required: false,
    type: ValidType.UNIX_TIMESTAMP,
  },
  SEND_LOG: { key: "sendLog", required: false, type: ValidType.ARRAY },
  READ_LOG: { key: "readLog", required: false, type: ValidType.ARRAY },
  DEL_LOG: { key: "delLog", required: false, type: ValidType.ARRAY },
};

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

  sendCustomStickerLog({contentsId, contentsCount}) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const customStickerLogDao = new CustomStickerLogDao(dbMongo, logDate);
    customStickerLogDao.insertOne(new CustomStickerLog({uid, logDate, contentsId, contentsCount}));
  }

  sendStreamingLog({id, endType, elapsedTime}) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const streamingLogDao = new StreamingLogDao(dbMongo, logDate);
    streamingLogDao.insertOne(new StreamingLog({uid, logDate, id, endType, elapsedTime}));
  }

  sendVoiceLog({ storyId, soundIndex, sceneIndex, length }) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const voiceLogDao = new VoiceLogDao(dbMongo, logDate);
    voiceLogDao.insertOne(
      new VoiceLog({ uid, logDate, storyId, soundIndex, sceneIndex, length })
    );
  }

  sendPictureLog({ success, debugLog, location, errCode, retry }) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const pictureLogDao = new PictureLogDao(dbMongo, logDate);
    pictureLogDao.insertOne(
      new PictureLog({
        uid,
        success,
        debugLog,
        errCode,
        logDate,
        location,
        retry,
      })
    );
  }

  sendPreviewLog({ after, before, storyId }) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const previewLogDao = new PreviewLogDao(dbMongo, logDate);
    previewLogDao.insertOne(
      new PreviewLog({ uid, logDate, after, before, storyId })
    );
  }

  sendFeedbackLog({ point, desc, debugString }) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const feedbackLogDao = new FeedbackLogDao(dbMongo, logDate);
    feedbackLogDao.insertOne(
      new FeedbackLog({ uid, logDate, point, desc, debugString })
    );
  }

  sendSceneLog({ storyId, lang, sceneIndex, elapsedTime }) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const sceneLogDao = new SceneLogDao(dbMongo, logDate);
    sceneLogDao.insertOne(
      new SceneLog({ uid, storyId, lang, sceneIndex, elapsedTime, logDate })
    );
  }

  sendUILog({ storyId, lang, uiName, etcData }) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const sceneLogDao = new UILogDao(dbMongo, logDate);
    sceneLogDao.insertOne(
      new UILog({ uid, storyId, lang, uiName, etcData, logDate })
    );
  }

  sendUserDeleteLog({ reasonId, reasonText }) {
    const uid = this.getUID();
    const logDate = this.getUpdateDate();

    const userDeleteLogDao = new UserDeleteLogDao(dbMongo, logDate);
    
    userDeleteLogDao.insertOne(
      new UserDeleteLog({ uid, reasonId, reasonText, logDate })
    );
  }

  sendUserAIStickerLog({ uid, prompt, keyword, lastKeyword }) {
    const logDate = this.getUpdateDate();
    const aiStickerLogDao = new AIStickerLogDao();

    aiStickerLogDao.insertOne(
      new AIStickerLog({ uid, prompt, keyword, lastKeyword }, logDate)
    )
  }

  throwNoExitMail(uid, mailId) {
    throw new SSError.Service(
      SSError.Service.Code.noExistMail,
      `${uid} - ${mailId}`
    );
  }
}
module.exports = LogService;
module.exports.Schema = Schema;
