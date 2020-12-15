require('../../apps/startup');
const assert = require('assert');
const TestHelper = require('../testHelper');
const SSError = require('@ss/error');
const UserDao = require('@ss/dao/UserDao');
const User = require('@ss/models/mongo/User');

const moment = require('moment');

let dbMongo = null;
let userDao = null;

before(async () => {
    await require('@app/api-server/boot/initSS')();
    dbMongo = require('@ss/dbMongo');

    userDao = new UserDao(dbMongo);
});

after(() => {

})

describe('dbMongo', () => {
    describe('create', () => {
        it('db is not null', () => {
            assert.equal(!dbMongo, false);
        });

        it('userConnect is not null', () => {
            assert.equal(!dbMongo.userConnect, false);
        });
    });
});

describe('dao', () => {
    describe('create', () => {
        it('userDao is not null', () => {
            assert.equal(!userDao, false);
        });
    })
})

function checkSameUser(user, compareUser) {
    assert.equal(user[User.Schema.UID.key], compareUser[User.Schema.UID.key]);
    assert.equal(user[User.Schema.EMAIL.key], compareUser[User.Schema.EMAIL.key]);
    assert.equal(user[User.Schema.PROVIDER.key], compareUser[User.Schema.PROVIDER.key]);
    assert.equal(user[User.Schema.CREATE_DATE.key], compareUser[User.Schema.CREATE_DATE.key]);
    assert.equal(user[User.Schema.LAST_LOGIN_DATE.key], compareUser[User.Schema.LAST_LOGIN_DATE.key]);
    assert.equal(user[User.Schema.POLICY_VERSION.key], compareUser[User.Schema.POLICY_VERSION.key]);
}

function createTempUserObj(uid, policyVersion, status) {
    const unixTimeStamp = moment().unix();
    const email = `${uid}@test.com`;
    const provider = 'google';
    const createDate = unixTimeStamp;
    const lastLoginDate = unixTimeStamp;
    
    return { uid, email, provider, createDate, lastLoginDate, policyVersion, status };
}

describe('daoUser', () => {
    describe('basic', () => {
        let testNewUser = null;
        before(async () => {
            testNewUser = new User(createTempUserObj('testId1', 1, 1));
            await userDao.insertOne(testNewUser);
        });

        after(async () => {
            await userDao.deleteAll();
        })

        describe('find', () => {
            it('findOne - uid', async () => {
                const findUser = await userDao.findOne({ uid: testNewUser[User.Schema.UID.key] });
                checkSameUser(findUser, testNewUser);
            });

            it('findOne - email', async () => {
                const findUser = await userDao.findOne({ email: testNewUser[User.Schema.EMAIL.key] });
                checkSameUser(findUser, testNewUser);
            });
        })

        describe('insert', () => {
            it('insertOne', async () => {
                const newUser = new User(createTempUserObj('testId2', 1, 1));
                await userDao.insertOne(newUser);

                const findUser = await userDao.findOne({ uid: newUser[User.Schema.UID.key] });
                checkSameUser(findUser, newUser);
            })
        });

        describe('update', () => {
            it('updateOne', async () => {
                const newUser = new User(createTempUserObj('testId3', 1, 1));
                await userDao.insertOne(newUser);

                await userDao.updateOne({ uid: newUser[User.Schema.UID.key] }, { policyVersion: 2 });

                const findUser = await userDao.findOne({ uid: newUser[User.Schema.UID.key] });

                assert.equal(findUser[User.Schema.POLICY_VERSION.key], 2);
                assert.equal(findUser[User.Schema.UID.key], newUser[User.Schema.UID.key]);
                assert.equal(findUser[User.Schema.EMAIL.key], newUser[User.Schema.EMAIL.key]);
                assert.equal(findUser[User.Schema.CREATE_DATE.key], newUser[User.Schema.CREATE_DATE.key]);
                assert.equal(findUser[User.Schema.LAST_LOGIN_DATE.key], newUser[User.Schema.LAST_LOGIN_DATE.key]);
                assert.equal(findUser[User.Schema.PROVIDER.key], newUser[User.Schema.PROVIDER.key]);
            });
        });

        describe('delete', () => {
            it('deleteOne', async () => {
                const newUser = new User(createTempUserObj('testId4', 1, 1));
                await userDao.insertOne(newUser);
                await userDao.deleteOne(newUser);
            })
        })
    });

    describe('exception', () => {
        describe('findOne', () => {
            describe('checkWhere', () => {
                describe('checkAllowWhereField', () => {
                    const allScemaList = Object.values(User.Schema);
                    const allowScemaList = UserDao.allowWhereFieldList();
                    const notAllow = allScemaList.filter(item => !allowScemaList.includes(item.key));
                    for (const item of notAllow) {
                        it(`${item.key}`, async () => {
                            try {
                                let tempObj = {};
                                tempObj[item.key] = item.key;
                                await userDao.findOne(tempObj);
                                TestHelper.throwNeedError();
                            }
                            catch (err) {
                                const expectError = new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
                                TestHelper.isSameError(expectError, err);
                            }
                        })
                    }
                });

                function createWhereObj(key, value) {
                    let tempObj = {}
                    tempObj[key] = value;
                    return tempObj;
                }
                describe('validValue', () => {
                    describe('validsString', () => {
                        const itemList = [];
                        itemList.push(createWhereObj(User.Schema.UID.key, 10));
                        itemList.push(createWhereObj(User.Schema.EMAIL.key, 10));
                        
                        for (const item of itemList) {
                            const _key = Object.keys(item)[0];
                            const _value = Object.values(item)[0];
                            it(`${_key} - ${_value}`, async () => {
                                try {
                                    await userDao.findOne(item);
                                    TestHelper.throwNeedError();
                                }
                                catch (err) {
                                    const expectError = new SSError.Model(SSError.Model.Code.checkType);
                                    TestHelper.isSameError(expectError, err);
                                }
                            })
                        }
                    });
                })

                describe('validEmail', () => {
                    const itemList = [];
                    itemList.push(createWhereObj(User.Schema.EMAIL.key, 'abc'));
                    itemList.push(createWhereObj(User.Schema.EMAIL.key, 'asdfb@'));
                    itemList.push(createWhereObj(User.Schema.EMAIL.key, 'asdfb@dfkjkdf'));
                    itemList.push(createWhereObj(User.Schema.EMAIL.key, '123@123'));
                    
                    for (const item of itemList) {
                        const _key = Object.keys(item)[0];
                        const _value = Object.values(item)[0];
                        it(`${_key} - ${_value}`, async () => {
                            try {
                                await userDao.findOne(item);
                                TestHelper.throwNeedError();
                            }
                            catch (err) {
                                const expectError = new SSError.Model(SSError.Model.Code.notValidEmail);
                                TestHelper.isSameError(expectError, err);
                            }
                        })
                    }
                })
            });
        })
    })
})

