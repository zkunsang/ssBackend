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

const urlUserAction = '/user/action';
const urlAuthLogin = '/auth/login';

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

            const result = await testRequest(urlUserAction, params);
            const { error } = result.body;
            assert.equal(error.code, ModelError.Code.requiredField.code);
            assert.notEqual(error.additional.indexOf('[sessionId]') === -1, true);
        });

        it('noExist sessionId', async () => {
            const params = {
                sessionId: '123'
            };

            const result = await testRequest(urlUserAction, params);
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

        it('required field actionList', async () => {

            const params = { sessionId };

            const result = await testRequest(urlUserAction, params);
            const { error } = result.body;
            assert.equal(error.code, ModelError.Code.requiredField.code);
            assert.notEqual(error.additional.indexOf('[actionList]') === -1, true);
        });

        it('required field storyId', async () => {
            const actionList = [];
            const params = { sessionId, actionList };

            const result = await testRequest(urlUserAction, params);
            const { error } = result.body;
            assert.equal(error.code, ModelError.Code.requiredField.code);
            assert.notEqual(error.additional.indexOf('[storyId]') === -1, true);
        });

        it('required field storyId', async () => {
            const storyId = 'test';
            const actionList = [];
            const params = { sessionId, actionList, storyId };

            const result = await testRequest(urlUserAction, params);
            const { error } = result.body;
            assert.equal(error.code, ModelError.Code.requiredField.code);
            assert.notEqual(error.additional.indexOf('[storyId]') === -1, true);
        });
    });
})


