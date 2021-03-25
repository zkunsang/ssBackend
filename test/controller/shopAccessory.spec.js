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

const urlShopAccessory = '/shop/accessory';
const urlLogin = '/auth/login';

const provider = 'google';
const providerId = 'shopAccessoryTest';
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
        const itemId = 'dfkdf';
        const result = await testRequest(urlShopAccessory, { sessionId, itemId });
        const { error } = result.body;
        assert.equal(error.code, ServiceError.Code.noExistItemList.code);
        // assert.notEqual(error.additional.indexOf('[itemId]') === -1, true);
    })

    it('success', async () => {
        const itemId = 'cmtree0';
        const result = await testRequest(urlShopAccessory, { sessionId, itemId });
        const { error } = result.body;
        assert.equal(error, undefined);
    })

    async function purchaseItem(itemId, checkError) {
        const result = await testRequest(urlShopAccessory, { sessionId, itemId });
        checkError(result.body);
    }

    async function purchaseItemSuccess(itemId) {
        const result = await testRequest(urlShopAccessory, { sessionId, itemId });
        const { error } = result.body;
        assert.equal(error, undefined);
    }

    it('already have', async () => {
        await purchaseItem('cmtree0', ({ error }) =>
            assert.equal(error.code, ServiceError.Code.alreadyHaveItem.code)
        );

    })

    it('noPurchaseImpossible', async () => {
        await purchaseItem('elfhat0', ({ error }) => {
            // assert.equal(error, !undefined);
            assert.notEqual(error, undefined);
            assert.equal(error.code, ServiceError.Code.purchaseNotPossible.code)
        });
    })

    it('already have', async () => {
        await purchaseItem('cookie0', ({ error }) =>
            assert.equal(error, undefined)
        );
        await purchaseItem('devilheadband0', ({ error }) => {
            assert.equal(error, undefined)
        });

        await purchaseItem('earmuffs0', ({ error }) => {
            assert.equal(error, undefined)
        });

        await purchaseItem('eyepatch0', ({ error }) => {
            assert.equal(error, undefined)
        });

        await purchaseItem('fire0', ({ error }) => {
            assert.equal(error.code, ServiceError.Code.useItemNotEnoughItem.code)
        });

    })
})

