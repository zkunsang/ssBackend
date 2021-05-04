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

const urlQuestAccept = '/quest/accept';
const urlAuthLogin = '/auth/login';
const urlShopStory = '/shop/story';

async function testRequest(url, params) {
    return await request.post(url)
        .set({ 'Content-Type': 'application/json' })
        .send(params);
}

const provider = 'google';
const providerId = 'userCheckTest';

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

describe('userCheck', function () {
    const UserTestUtil = require('../util/UserTestUtil');
    let userTestUtil = null;
    before(async () => {
        userTestUtil = new UserTestUtil();
        userTestUtil.findAndDeleteUser(provider, providerId);
    })

    describe('auth fail', () => {
        it('sessionId', async () => {
            const params = {};

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error.code, ModelError.Code.requiredField.code);
        });

        it('noExist sessionId', async () => {
            const params = {
                sessionId: '123'
            };

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error.code, ServiceError.Code.noExistSession.code);
        });
    });

    describe('auth success', () => {
        let sessionId = null;

        before(async () => {


            const result = await testRequest(urlAuthLogin, reqAuthLogin);
            const { data } = result.body;
            sessionId = data.sessionId;
        })

        it('required field [storyId]', async () => {

            const params = { sessionId };

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error.code, ModelError.Code.requiredField.code);
            assert.notEqual(error.additional.indexOf('[storyId]') === -1, true);

        });

        it('required field [questId]', async () => {
            const storyId = 'test';
            const params = { sessionId, storyId };

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error.code, ModelError.Code.requiredField.code);
            assert.notEqual(error.additional.indexOf('[questId]') === -1, true);
        });

        it('storyNoExist', async () => {
            const storyId = 'test';
            const questId = '123'
            const params = { sessionId, storyId, questId };

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error.code, ServiceError.Code.storyNoExist.code);
        });

        it('noExistStoryQuest', async () => {
            const storyId = 'PussInBoots';
            const questId = '123'
            const params = { sessionId, storyId, questId };

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error.code, ServiceError.Code.noExistStoryQuest.code);
        });

        it('success', async () => {
            const storyId = 'PussInBoots';
            const questId = '1'
            const params = { sessionId, storyId, questId };

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error, undefined);
        });

        it('needPurchase', async () => {
            const storyId = 'nutcracker';
            const questId = '1'
            const params = { sessionId, storyId, questId };

            const result = await testRequest(urlQuestAccept, params);
            const { error } = result.body;
            assert.equal(error.code, ServiceError.Code.needPurchase.code);
        });

        describe('purchase', async () => {
            before(async () => {
                const storyList = ['nutcracker'];
                const params = { sessionId, storyList };
                const result = await testRequest(urlShopStory, params);
                const { data } = result.body;
                // const { inventory } = data;
            })

            it('noExistStoryQuest', async () => {
                const storyId = 'nutcracker';
                const questId = '1'
                const params = { sessionId, storyId, questId };

                const result = await testRequest(urlQuestAccept, params);
                const { error } = result.body;
                assert.equal(error.code, ServiceError.Code.noExistStoryQuest.code);
            })
        })
    });
})

