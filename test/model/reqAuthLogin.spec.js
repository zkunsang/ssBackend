require('../../apps/startup');

const assert = require('assert');
const ReqAuthLogin = require('@ss/models/controller/ReqAuthLogin');
const ValidateUtil = require('@ss/util/ValidateUtil')

const Provider = ValidateUtil.Provider;
const AuthLoginSchema = ReqAuthLogin.Schema;

const SSError = require('@ss/error')
const TestHelper = require('../testHelper');

before(() => {

})

after(() => {

})

function createReqAuthLoginBody(uid, email, provider) {
    return { uid, email, provider }
}

describe('reqAuthLogin', () => {
    describe('constructor', () => {
        const requestBody = createReqAuthLoginBody('testUid', 'zkunsang@gmail.com', Provider.GOOGLE);
        const reqAuthLogin = new ReqAuthLogin(requestBody);

        assert.equal(reqAuthLogin[AuthLoginSchema.UID.key], requestBody[AuthLoginSchema.UID.key]);
        assert.equal(reqAuthLogin[AuthLoginSchema.EMAIL.key], requestBody[AuthLoginSchema.EMAIL.key]);
        assert.equal(reqAuthLogin[AuthLoginSchema.PROVIDER.key], requestBody[AuthLoginSchema.PROVIDER.key]);
    });

    describe('validModel', () => {
        it('success', () => {
            const requestBody = createReqAuthLoginBody('testUid', 'zkunsang@gmail.com', Provider.GOOGLE);
            const reqAuthLogin = new ReqAuthLogin(requestBody);

            ReqAuthLogin.validModel(reqAuthLogin);
        });

        describe('exception', () => {
            describe('required field', () => {
                const basicBody = createReqAuthLoginBody('testUid', 'zkunsang@gmail.com', Provider.GOOGLE);
                const testList = Object.keys(basicBody);

                for (const deleteField of testList) {
                    it(`${deleteField}`, () => {
                        try {
                            const reqBody = Object.assign({}, basicBody);
                            delete reqBody[deleteField];
                            const req = new ReqAuthLogin(reqBody);
                            ReqAuthLogin.validModel(req);
                            TestHelper.throwNeedError();
                        }
                        catch (err) {
                            TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.requiredField));
                        }

                    })
                }
            })

            describe('check type', () => {
                const testList = [];
                testList.push({ testField: 'uid', reqBody: createReqAuthLoginBody(123, 'zkunsang@gmail.com', Provider.GOOGLE) })
                testList.push({ testField: 'email', reqBody: createReqAuthLoginBody('zkunsang', 123, Provider.GOOGLE) });
                testList.push({ testField: 'provider', reqBody: createReqAuthLoginBody('zkunsang', 'zkunsang@gmail.com', 123) });

                for (const test of testList) {
                    it(`${test.testField}`, () => {
                        try {
                            const reqBody = test.reqBody;
                            const req = new ReqAuthLogin(reqBody);
                            ReqAuthLogin.validModel(req);
                            TestHelper.throwNeedError();
                        } catch (err) {
                            TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.checkType))
                        }

                    })
                }
            });

            describe('email validation', () => {
                const testList = [];
                testList.push(createReqAuthLoginBody('zkunsang', 'zkunsang', Provider.GOOGLE))
                testList.push(createReqAuthLoginBody('zkunsang', 'zkunsang@gmail', Provider.GOOGLE));
                testList.push(createReqAuthLoginBody('zkunsang', 'zkunsang@.com', Provider.GOOGLE));
                testList.push(createReqAuthLoginBody('zkunsang', '@gmail.com', Provider.GOOGLE));

                for (const test of testList) {
                    it(`${test.email}`, () => {
                        try {
                            const reqBody = test;
                            const req = new ReqAuthLogin(reqBody);
                            ReqAuthLogin.validModel(req);
                            TestHelper.throwNeedError();
                        } catch (err) {
                            TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.notValidEmail));
                        }
                    })
                }
            });

            describe('provider range', () => {
                it('provider range', () => {
                    const reqBody = createReqAuthLoginBody('zkunsang', 'zkunsang@gmail.com', 'testProvider');
                    const req = new ReqAuthLogin(reqBody);

                    try {
                        ReqAuthLogin.validModel(req);
                        TestHelper.throwNeedError();
                    } catch (err) {
                        TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.validRangeValue));
                    }
                })
            })
        })
    });

    describe('validValue', () => {
        it('success', () => {
            const requestBody = createReqAuthLoginBody('testUid', 'zkunsang@gmail.com', Provider.GOOGLE);
            const reqAuthLogin = new ReqAuthLogin(requestBody);

            ReqAuthLogin.validModel(reqAuthLogin);
        });

        describe('exception', () => {
            describe('required field', () => {
                const basicBody = createReqAuthLoginBody('testUid', 'zkunsang@gmail.com', Provider.GOOGLE);
                const testList = Object.keys(basicBody);

                for (const deleteField of testList) {
                    it(`${deleteField}`, () => {
                        try {
                            const reqBody = Object.assign({}, basicBody);
                            delete reqBody[deleteField];
                            const req = new ReqAuthLogin(reqBody);
                            ReqAuthLogin.validModel(req);
                            TestHelper.throwNeedError();
                        }
                        catch (err) {
                            TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.requiredField));
                        }

                    })
                }
            })

            describe('check type', () => {
                const testList = [];
                testList.push({ testField: 'uid', reqBody: createReqAuthLoginBody(123, 'zkunsang@gmail.com', Provider.GOOGLE) })
                testList.push({ testField: 'email', reqBody: createReqAuthLoginBody('zkunsang', 123, Provider.GOOGLE) });
                testList.push({ testField: 'provider', reqBody: createReqAuthLoginBody('zkunsang', 'zkunsang@gmail.com', 123) });

                for (const test of testList) {
                    it(`${test.testField}`, () => {
                        try {
                            const reqBody = test.reqBody;
                            const req = new ReqAuthLogin(reqBody);
                            ReqAuthLogin.validModel(req);
                            TestHelper.throwNeedError();
                        } catch (err) {
                            TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.checkType))
                        }

                    })
                }
            });

            describe('email validation', () => {
                const testList = [];
                testList.push(createReqAuthLoginBody('zkunsang', 'zkunsang', Provider.GOOGLE))
                testList.push(createReqAuthLoginBody('zkunsang', 'zkunsang@gmail', Provider.GOOGLE));
                testList.push(createReqAuthLoginBody('zkunsang', 'zkunsang@.com', Provider.GOOGLE));
                testList.push(createReqAuthLoginBody('zkunsang', '@gmail.com', Provider.GOOGLE));

                for (const test of testList) {
                    it(`${test.email}`, () => {
                        try {
                            const reqBody = test;
                            const req = new ReqAuthLogin(reqBody);
                            ReqAuthLogin.validModel(req);
                            TestHelper.throwNeedError();
                        } catch (err) {
                            TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.notValidEmail));
                        }
                    })
                }
            });

            describe('provider range', () => {
                it('provider range', () => {
                    const reqBody = createReqAuthLoginBody('zkunsang', 'zkunsang@gmail.com', 'testProvider');
                    const req = new ReqAuthLogin(reqBody);

                    try {
                        ReqAuthLogin.validModel(req);
                        TestHelper.throwNeedError();
                    } catch (err) {
                        TestHelper.isSameError(err, new SSError.Model(SSError.Model.Code.validRangeValue));
                    }
                })
            })
        })
    })

}) 