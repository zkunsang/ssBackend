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

const url = '/auth/login'
async function testRequest(params) {
    return await request.post(url)
        .set({ 'Content-Type': 'application/json' })
        .send(params);
}

describe('AuthLogin', function () {
    describe('fail - required field', () => {
        describe('required field', () => {
            it('email', async () => {
                const params = { test: '123' };
                const result = await testRequest(params);

                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[email]') === -1, true);
            });

            it('provider', async () => {
                const params = { email: 'zkunsang@gmail.com' };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[provider]') === -1, true);
            });

            it('providerId', async () => {
                const params = { email: 'zkunsang@gmail.com', provider: 'aos' };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.validRangeValue.code);
                assert.notEqual(error.additional.indexOf('[provider]') === -1, true);
            });

            it('deviceId', async () => {
                const params = { email: 'zkunsang@gmail.com', provider: 'google', providerId: '123' };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[deviceId]') === -1, true);
            });

            it('platform', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123'
                };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[platform]') === -1, true);
            });

            it('platform validRangeValue', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123',
                    platform: '123'
                };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.validRangeValue.code);
                assert.notEqual(error.additional.indexOf('[platform]') === -1, true);
            });

            it('clientVersion', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123',
                    platform: 'aos'
                };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[clientVersion]') === -1, true);
            });

            it('appStore', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123',
                    platform: 'aos',
                    clientVersion: '1.0.1'
                };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[appStore]') === -1, true);
            });

            it('appStore validRange', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123',
                    platform: 'aos',
                    clientVersion: '1.0.1',
                    appStore: '123'
                };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.validRangeValue.code);
                assert.notEqual(error.additional.indexOf('[appStore]') === -1, true);
            });

            it('deviceName', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123',
                    platform: 'aos',
                    clientVersion: '1.0.1',
                    appStore: 'google'
                };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[deviceName]') === -1, true);
            });

            it('gameLanguage', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123',
                    platform: 'aos',
                    clientVersion: '1.0.1',
                    appStore: 'google',
                    deviceName: 'deviceName'
                };
                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[gameLanguage]') === -1, true);
            });

            it('osVersion', async () => {
                const params = {
                    email: 'zkunsang@gmail.com',
                    provider: 'google',
                    providerId: '123',
                    deviceId: '123',
                    platform: 'aos',
                    clientVersion: '1.0.1',
                    appStore: 'google',
                    deviceName: 'deviceName',
                    gameLanguage: 'gameLanguage'
                };

                const result = await testRequest(params);
                const { error } = result.body;
                assert.equal(error.code, ModelError.Code.requiredField.code);
                assert.notEqual(error.additional.indexOf('[osVersion]') === -1, true);
            });
        });
    });

    describe('success', () => {
        it('login success', async () => {
            const params = {
                email: 'zkunsang@gmail.com',
                provider: 'google',
                providerId: '123',
                deviceId: '123',
                platform: 'aos',
                clientVersion: '1.0.1',
                appStore: 'google',
                deviceName: 'deviceName',
                gameLanguage: 'gameLanguage',
                osVersion: '123'
            };

            const result = await testRequest(params);
            const { error } = result.body;
            assert.isUndefined(error);
        });
    })
})


