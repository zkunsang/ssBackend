const ReqShopProduct = require('@ss/models/controller/ReqShopProduct');

const SSError = require('@ss/error');
const ValidateUtil = require('@ss/util/ValidateUtil')
const PurchaseStatus = ValidateUtil.PurchaseStatus;
const ArrayUtil = require('@ss/util/ArrayUtil');

const UserService = require('@ss/service/UserService');
const ProductService = require('@ss/service/ProductService');
const InventoryService = require('@ss/service/InventoryService');

module.exports = async (ctx, next) => {
    const purchaseDate = ctx.$date;
    const userInfo = ctx.$userInfo
    const userDao = ctx.$userDao;

    const reqShopProduct = new ReqShopProduct(ctx.request.body);
    ReqShopProduct.validModel(reqShopProduct);

    const productService = new ProductService(userInfo, purchaseDate);

    const receipt = await productService.validateReceipt(reqShopProduct);

    if (receipt.purchaseState === PurchaseStatus.FAIL) {
        ctx.$res.badRequest(SSError.Service.Code.shopReceiptFail);
        return;
    }

    const receiptHistory = await productService.checkReceipt();

    // 이미 처리된 내역이 있으면 
    // TODO: error code and data
    if (receiptHistory) {
        ctx.$res.set({ purchaseState: 0 });
        ctx.$res.badRequest(SSError.Service.Code.shopAlreadyPurchased);
        return;
    }

    const inventoryService = new InventoryService(userInfo, purchaseDate);
    const userService = new UserService(userInfo, userDao, purchaseDate);

    const productRewardList = productService.getProductRewardList();

    const inventoryList = ArrayUtil.map(productRewardList, (item) => item.makeInventoryObject());

    inventoryService.putItem(InventoryService.PUT_ACTION.PURCHASE.CASH, {}, inventoryList);

    const inventory = inventoryService.finalize();
    userService.setInventory(inventory);

    userService.finalize();
    productService.finalize();

    ctx.$res.success({
        inventory,
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