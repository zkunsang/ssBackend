const ReqShopProduct = require('@ss/models/controller/ReqShopProduct');

const InventoryDao = require('@ss/daoMongo/InventoryDao');
const ReceiptDao = require('@ss/daoMongo/ReceiptDao');

const ProductService = require('@ss/service/ProductService');

const ProductCache = require('@ss/dbCache/ProductCache');
const ProductRewardCache = require('@ss/dbCache/ProductRewardCache');

const ProductLog = require('@ss/models/apilog/ProductLog');

const ValidateUtil = require('@ss/util/ValidateUtil')
const PurchaseStatus = ValidateUtil.PurchaseStatus;

const InventoryService = require('@ss/service/InventoryService');
const helper = require('@ss/helper');
const SSError = require('@ss/error');

function makeInventoryList(productRewardList) {
    return productRewardList.map((item) => item.makeInventoryObject());
}

function createProductLog(userInfo, productInfo, purchaseDate) {
    const uid = userInfo.uid;
    const productId = productInfo.productId;
    const cost = productInfo.costKr;

    return new ProductLog({ uid, productId, cost, purchaseDate });
}

module.exports = async (ctx, next) => {
    const purchaseDate = ctx.$date;
    const userInfo = ctx.$userInfo
    const reqShopProduct = new ReqShopProduct(ctx.request.body);
    ReqShopProduct.validModel(reqShopProduct);

    const uid = userInfo.getUID();
    const receipt = await ProductService.validateReceipt(uid, reqShopProduct, purchaseDate);

    if (receipt.purchaseState === PurchaseStatus.FAIL) {
        ctx.$res.badRequest(SSError.Service.Code.shopReceiptFail);
        return;
    }

    const transactionId = receipt.getTransactionId();

    const receiptDao = new ReceiptDao(ctx.$dbMongo);

    const receiptHistory = await receiptDao.findOne({ transactionId });

    // 이미 처리된 내역이 있으면 
    if(receiptHistory) {
        ctx.$res.set({purchaseState: 0});
        ctx.$res.badRequest(SSError.Service.Code.shopAlreadyPurchased);
        return;
    }

    const productId = ProductService.getProductId(receipt.productId);
    
    const productInfo = ProductCache.get(productId);

    if (!productInfo) {
        ctx.$res.badRequest(SSError.Service.Code.shopNoExistProduct);
        return;
    }

    const inventoryDao = new InventoryDao(ctx.$dbMongo);
    
    const productRewardList = ProductRewardCache.get(productId);
    
    const inventoryService = new InventoryService(inventoryDao, userInfo, purchaseDate);

    const inventoryList = makeInventoryList(productRewardList);
    await inventoryService.processPut(
        InventoryService.PUT_ACTION.PURCHASE.CASH,
        inventoryList);

    await receiptDao.insertOne(receipt);

    helper.fluent.sendProductLog(createProductLog(userInfo, productInfo, purchaseDate));
    
    const userInventoryList = await inventoryService.getUserInventoryList();
    InventoryService.removeObjectIdList(userInventoryList);
    
    ctx.$res.success({ 
        inventoryList: userInventoryList,
        purchaseState: 0
     });

    await next();
}

/**
 * @swagger
 * resourcePath: /shop
 * description: All about API
 */

/**
 * @swagger
 * path: /shop/product
 * operations:
 *   -  httpMethod: POST
 *      summary: 상품 구매
 *      notes: |
 *        <br><b>requestParam</b>
 *        <br>receipt: 영수증
 *        <br>appStore (String): 스토어(google|onestore|appstore),
 *      responseClass: resShopPurchase
 *      nickname: config
 *      consumes:
 *        - text/html
 *      parameters:
 *        - name: body
 *          paramType: body
 *          dataType: reqShopPurchase
 *          required: true
 *
 */

/**
 * @swagger
 * models:
 *   reqShopPurchase:
 *     id: reqShopPurchase
 *     properties:
 *       sessionId:
 *         type: String
 *         required: true
 *         description: 세션 아이디
 *       receipt:
 *         type: String
 *         required: true
 *         description: 영수증
 *       appStore:
 *         type: String
 *         required: true
 *         description: 앱스토어
 *   resShopPurchase:
 *     id: resShopPurchase
 *     properties:
 *       common:
 *         type: common
 *       error:
 *         type: error
 * */