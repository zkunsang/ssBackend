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

const urlShopStory = '/shop/story';
const urlLogin = '/auth/login';
const urlCheatPurchase = '/cheat/purchase'
const urlInfo = '/user/info';

const provider = 'google';
const providerId = 'shopStoryTest';
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

    it('required Field storyList', async () => {
        const result = await testRequest(urlShopStory, { sessionId });
        const { error } = result.body;
        assert.equal(error.code, ModelError.Code.requiredField.code);
        assert.notEqual(error.additional.indexOf('[storyList]') === -1, true);
    })

    it('empty storyList', async () => {
        const storyList = [];
        const result = await testRequest(urlShopStory, { sessionId, storyList });
        const { error } = result.body;
        assert.equal(error.code, ServiceError.Code.emptyArray.code);
    })

    it('wrong storyList', async () => {
        const storyList = ['test'];
        const result = await testRequest(urlShopStory, { sessionId, storyList });
        const { error } = result.body;
        assert.equal(error.code, ServiceError.Code.noExistItemList.code);
    })

    it('already Have Item', async () => {
        const storyList = ['PussInBoots'];
        const result = await testRequest(urlShopStory, { sessionId, storyList });
        const { error } = result.body;
        assert.equal(error.code, ServiceError.Code.alreadyHaveItem.code);
    })

    it('success', async () => {
        const storyList = ['AliceInWonderland'];
        const result = await testRequest(urlShopStory, { sessionId, storyList });
        const { error } = result.body;
        assert.equal(error, undefined);
    })

    describe('zero value', () => {
        let honeyCount = 0;
        before(async () => {
            const result = await testRequest(urlInfo, { sessionId });
            const { error, data } = result.body;
            const { inventory } = data;
            const honeyItem = inventory.filter((item) => item.itemId === 'honey');
            honeyCount = honeyItem[0].itemQny;
        })

        it('not enough honey', async () => {
            // 0원일 때 구매
            assert.equal(honeyCount, 0);

            const storyList = ['PeterPan'];
            const result = await testRequest(urlShopStory, { sessionId, storyList });
            const { error } = result.body;

            assert.equal(error.code, ServiceError.Code.useItemNotEnoughItem.code);
        });
    });

    describe('multi buy', async () => {
        let beforeCount = 0;
        before(async () => {

            // honey 110
            const productId = 'cost10000';
            const result = await testRequest(urlCheatPurchase, { sessionId, productId });
            const { data } = result.body;
            const { inventory } = data;
            const pictureSlot = inventory.filter((item) => item.itemId === 'honey')
            beforeCount = pictureSlot[0].itemQny;
        });

        it('success', async () => {
            const storyList = ['snowsoup', 'Goldilocks'];
            const result = await testRequest(urlShopStory, { sessionId, storyList });
            const { error } = result.body;

            assert.equal(error, undefined);
        })

        it('fail', async () => {
            const storyList = ['sunandmoon', 'pinocchio'];
            const result = await testRequest(urlShopStory, { sessionId, storyList });
            const { error } = result.body;

            assert.equal(error.code, ServiceError.Code.useItemNotEnoughItem.code);
        })
    });

})

