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

    noExistItemList: { code: 32001, name: 'noExistItemList', message: 'found not exist item' },
    noExistStoryList: { code: 32002, name: 'noExistStoryList', message: 'found not exist story' },

    nonValidGoogleReceipt: { code: 33001, name: 'nonValidGoogleReceipt', message: 'nonValidGoogleReceipt' },
    alreadyProcessedReceipt: { code: 33002, name: 'alreadyProcessedReceipt', message: 'alreadyProcessedReceipt' },

    noExistSession: { code: 34001, name: 'noExistSession', message: 'noExistSession' },
    serviceUnavailable: { code: 34002, name: 'serviceUnavailable', message: 'serviceUnavailable' },
    prepareService: { code: 34003, name: 'prepareService', message: 'prepareService' },    

    couponNoExist: { code: 35001, name: 'couponNoExist', message: 'couponNoExist' },
    couponAlreadyUsed: { code: 35002, name: 'couponAlreadyUsed', message: 'couponAlreadyUsed' },
    couponUnavailable: { code: 35003, name: 'couponUnavailable', message: 'couponUnavailable' },
    couponManyTry: { code: 35004, name: 'couponManyTry', message: 'couponManyTry' },
    couponAlreadyOccupied: { code: 35005, name: 'couponAlreadyOccupied', message: 'couponAlreadyOccupied' },

    shopReceiptFail: { code: 36001, name: 'shopReceiptFail', message: 'shopReceiptFail' },
    shopAlreadyPurchased: { code: 36002, name: 'shopAlreadyPurchased', message: 'shopAlreadyPurchased' },
    shopNoExistProduct: { code: 36003, name: 'shopNoExistProduct', message: 'shopNoExistProduct' },
    
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

    for(const codeKey of codeKeyList) {
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