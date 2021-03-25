require('../../apps/startup');
const supertest = require('supertest');
const { assert } = require('chai');
const ServiceError = require('../../node_storyself/error/ServiceError');
const ModelError = require('../../node_storyself/error/ModelError');

let app = null;
let request = null;
let server = null;

before(async () => {
    await require('../../apps/api-server/boot/initSS')();
    app = await require('../../apps/api-server/boot/initHttp').initKoa();
    server = app.listen();
    request = supertest(server);
});

after(() => {
    server.close();
})

const urlShopAccessory = '/shop/item';
const urlLogin = '/auth/login';
const urlCheatPurchase = '/cheat/purchase'

const provider = 'google';
const providerId = 'shopItemTest';
const itemId = 'pictureSlot';

const reqAuthLogin = {
    email: 'zkunsang@gmail.com',
    provider,
    providerId,
    deviceId: '123',
    platform: 'aos',
    clientVersion: '1.0.1',
    appStore: 'google',
    deviceName: 'deviceName',
    gameLanguage: 'gameLanguage',
    osVersion: '123'
};

async function testRequest(url, params) {
    return await request.post(url)
        .set({ 'Content-Type': 'application/json' })
        .send(params);
}

describe('shopAccessory', function () {
    const UserTestUtil = require('../util/UserTestUtil');
    let userTestUtil = null;
    let sessionId = null;

    async function purchaseItem(itemId, checkError) {
        const result = await testRequest(urlShopAccessory, { sessionId, itemId });
        checkError(result.body);
    }

    before(async () => {
        // 유저 삭제

        userTestUtil = new UserTestUtil();
        await userTestUtil.findAndDeleteUser(provider, providerId);

        // 로그인
        const result = await testRequest(urlLogin, reqAuthLogin);
        const { data } = result.body;
        sessionId = data.sessionId;
    })

    after(async () => {
        // 생성된 유저 삭제
        await userTestUtil.findAndDeleteUser(provider, providerId);
    })

    it('required Field itemId', async () => {
        const result = await testRequest(urlShopAccessory, { sessionId });
        const { error } = result.body;
        assert.equal(error.code, ModelError.Code.requiredField.code);
        assert.notEqual(error.additional.indexOf('[itemId]') === -1, true);
    })

    it('noExistItemList', async () => {
        const itemId = 'temp'
        await purchaseItem(itemId, ({ error }) => {
            assert.equal(error.code, ServiceError.Code.noExistItemList.code);
        })
    })

    it('success', async () => {
        await purchaseItem(itemId, ({ error }) => {
            assert.equal(error, undefined);
        })
    })

    describe('multi buy', async () => {
        let beforeCount = 0;
        before(async () => {
            const productId = 'cost5000';
            const result = await testRequest(urlCheatPurchase, { sessionId, productId });
            const { data } = result.body;
            const { inventory } = data;
            const pictureSlot = inventory.filter((item) => item.itemId === 'pictureSlot')
            beforeCount = pictureSlot[0].itemQny;
        })

        it('counting', async () => {
            await purchaseItem(itemId, ({ error, data }) => {
                assert.equal(error, undefined);
                const { inventory } = data;
                const pictureSlot = inventory.filter((item) => item.itemId === "pictureSlot");
                assert.equal(pictureSlot[0].itemQny, ++beforeCount);
            });

            await purchaseItem(itemId, ({ error, data }) => {
                assert.equal(error, undefined);
                const { inventory } = data;
                const pictureSlot = inventory.filter((item) => item.itemId === "pictureSlot");
                assert.equal(pictureSlot[0].itemQny, ++beforeCount);
            })
        })

        it('not enough item', async () => {
            await purchaseItem(itemId, ({ error, data }) => {
                assert.equal(error, undefined);
                const { inventory } = data;
                const pictureSlot = inventory.filter((item) => item.itemId === "pictureSlot");
                assert.equal(pictureSlot[0].itemQny, ++beforeCount);
            })

            await purchaseItem(itemId, ({ error }) => {
                assert.notEqual(error, undefined);
                assert.equal(error.code, ServiceError.Code.useItemNotEnoughItem.code);
            })
        })
    })
})

