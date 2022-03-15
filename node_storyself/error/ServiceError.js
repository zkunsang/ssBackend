const RuntimeError = require('./RuntimeError');

const code = {
    isNull: { code: 30001, name: 'isNull', message: 'not allow null' },
    notArray: { code: 30002, name: 'notArray', message: 'it should be array' },
    emptyArray: { code: 30003, name: 'emptyArray', message: 'not allow empty array' },
    wrongArrayObject: { code: 30004, name: 'wrongArrayObject', message: 'array includes wrong object' },

    putItemNoExistItem: { code: 31001, name: 'putItemNoExistItem', message: 'put item no exist item' },
    putItemOverMaxQny: { code: 31002, name: 'putItemOverMaxQny', message: 'over max qny' },
    useItemNotEnoughItem: { code: 31003, name: 'putItemNotEnughItem', message: 'not enough Item' },
    useItemNoUseableItem: { code: 31004, name: 'useItemNoUseableItem', message: 'no useable item' },
    purchaseNotPossible: { code: 31005, name: 'purchaseNotPossible', message: 'purchase not possible' },
    alreadyHaveItem: { code: 31006, name: 'alreadyHaveItem', message: 'alreadyHaveItem' },
    needPurchase: { code: 31007, name: 'needPurchase', message: 'needPurchase' },

    noExistItemList: { code: 32001, name: 'noExistItemList', message: 'found not exist item' },
    noExistStoryList: { code: 32002, name: 'noExistStoryList', message: 'found not exist story' },

    nonValidGoogleReceipt: { code: 33001, name: 'nonValidGoogleReceipt', message: 'nonValidGoogleReceipt' },
    alreadyProcessedReceipt: { code: 33002, name: 'alreadyProcessedReceipt', message: 'alreadyProcessedReceipt' },

    noExistSession: { code: 34001, name: 'noExistSession', message: 'noExistSession' },
    serviceUnavailable: { code: 34002, name: 'serviceUnavailable', message: 'serviceUnavailable' },
    prepareService: { code: 34003, name: 'prepareService', message: 'prepareService' },
    loginFromOtherDevice: { code: 34004, name: 'logged in from other device', message: 'logged in from other device' },

    couponNoExist: { code: 35001, name: 'couponNoExist', message: 'couponNoExist' },
    couponAlreadyUsed: { code: 35002, name: 'couponAlreadyUsed', message: 'couponAlreadyUsed' },
    couponUnavailable: { code: 35003, name: 'couponUnavailable', message: 'couponUnavailable' },
    couponManyTry: { code: 35004, name: 'couponManyTry', message: 'couponManyTry' },
    couponAlreadyOccupied: { code: 35005, name: 'couponAlreadyOccupied', message: 'couponAlreadyOccupied' },
    subscriptionAlready: { code: 35006, name: 'subscriptionAlready', message: 'subscriptionAlready' },

    shopReceiptFail: { code: 36001, name: 'shopReceiptFail', message: 'shopReceiptFail' },
    shopAlreadyPurchased: { code: 36002, name: 'shopAlreadyPurchased', message: 'shopAlreadyPurchased' },
    shopNoExistProduct: { code: 36003, name: 'shopNoExistProduct', message: 'shopNoExistProduct' },
    shopNoExistProductReward: { code: 36004, name: 'shopNoExistProductReward', message: 'shopNoExistProductReward' },

    storyNoExist: { code: 37001, name: 'storyNoExist', message: 'storyNoExist' },

    noExistMail: { code: 38001, name: 'noExistMail', message: 'noExistMail' },
    alreadyReadMail: { code: 38002, name: 'alreadyReadMail', message: 'alreadyReadMail' },
    throwAlreadNotReadMail: { code: 38003, name: 'throwAlreadNotReadMail', message: 'throwAlreadNotReadMail' },

    noExistStoryQuest: { code: 39001, name: 'noExistStoryQuest', message: 'noExistStoryQuest' },

    noExistPageSticker: { code: 39101, name: 'noExistSPageSticker', message: 'noExistSPageSticker' }
}

class ServiceError extends RuntimeError {
    constructor(errObj, additionalMessage) {
        super('ServiceError', errObj);
        this.additionalMessage = additionalMessage;

    }
}

function createErrorCodeMap() {
    const codeKeyList = Object.keys(code);
    codeMap = {};

    for (const codeKey of codeKeyList) {
        this.codeMap[code[codeKey].code] = code[codeKey];
    }

    return codeMap;
}
/**
 * commonError: 30000
 * inventoryError: 31000
 * itemError: 32000,
 * storyError:
 */

module.exports = ServiceError;
module.exports.Code = code;
module.exports.CodeMap = createErrorCodeMap();