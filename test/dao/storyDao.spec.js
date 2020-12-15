require('../../apps/startup');
const { assert, expect } = require('chai');
const StoryDao = require('@ss/dao/StoryDao');
const Story = require('@ss/models/mongo/Story');
const SSError = require('@ss/error');
const TestHelper = require('../testHelper');
const _ = require('lodash');

let dbMongo = null;
let storyDao = null;

before(async () => {
    await require('@app/api-server/boot/initSS')();
    dbMongo = require('@@ss/dbMongo');

    storyDao = new StoryDao(dbMongo);
});

after(() => {

})

describe('dbMongo', () => {
    describe('create', () => {
        it('db is not null', () => {
            assert.equal(!dbMongo, false);
        })

        it('storyConnect is not null', () => {
            assert.equal(!dbMongo.storyConnect, false);
        });
    });
});

describe('dao', () => {
    describe('create', () => {
        it('storyDao is not null', () => {
            assert.equal(!storyDao, false);
        });
    })
})



describe('daoStory', () => {
    async function CRUDBefore() {
        await storyDao.deleteAll();
        const idList = ['storyId1', 'storyId2', 'storyId3', 'storyId4', 'storyId5', 'storyId6'];

        for (const item of idList) {
            await storyDao.insert(new Story({ storyId: item, status: 1 }));
        }
    }

    async function CRUDAfter() {
        await storyDao.deleteAll();
    }

    describe('basic', () => {

        before(async () => {
            await CRUDBefore();
            beforeStoryList = await storyDao.getList();
            beforeLength = beforeStoryList.length;
        });

        after(async () => {
            await CRUDAfter();
        })

        describe('get', () => {
            it('getOne', async () => {
                const find = { storyId: 'storyId1' };
                const story = await storyDao.getOne(find);

                assert.equal(story.storyId, find.storyId);
            });

            it('getOne - null', async () => {
                const find = { storyId: 'null id' };
                const story = await storyDao.getOne(find);

                assert.equal(story, null);
            });

            it('getList', async () => {
                const find = { storyId: 'storyId1' };
                const storyList = await storyDao.getList(find);

                assert.equal(storyList.length, 1);
                assert.equal(typeof storyList, typeof []);
            });

            it('getList - length 0', async () => {
                const find = { storyId: 'null id' };
                const storyList = await storyDao.getList(find);

                assert.equal(storyList.length, 0);
                assert.equal(typeof storyList, typeof []);
            });
        })

        describe('insert', () => {
            it('insert', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const story = new Story({ storyId: 'insertTestStoryId', status: 1 });
                await storyDao.insert(story);

                const afterStoryList = await storyDao.getList();
                const afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength + 1);
            });
        });

        describe('insertMany', () => {
            it('insertMany', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const idList = ['insertManyId1', 'insertManyId2', 'insertManyId3'];
                const insertManyList = [];
                idList.map((item) => insertManyList.push(new Story({ storyId: item, status: 1 })))
                await storyDao.insertMany(insertManyList);

                const afterStoryList = await storyDao.getList();
                const afterLength = afterStoryList.length;

                assert.equal(afterLength, beforeLength + idList.length)
                const afterStoryObj = _.keyBy(afterStoryList, 'storyId');
                for (const item of idList) {
                    assert.isNotNull(afterStoryObj[item]);
                }
            });
        })

        describe('update', () => {
            it('updateOne', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const insertStory = new Story({ storyId: 'updateIdTest', status: 1 });
                await storyDao.insert(insertStory);

                const afterStoryList = await storyDao.getList();
                const afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength + 1);

                const updateStory = { storyId: insertStory.storyId, status: 0 };
                const find = { storyId: updateStory.storyId };
                const $set = { status: updateStory.status };

                await storyDao.updateOne(find, $set);

                const findStory = await storyDao.getOne(find);

                assert.equal(updateStory.storyId, findStory.storyId);
                assert.equal(updateStory.status, findStory.status);
            });

            it('updateMany', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const expectUpdateCount = beforeStoryList.reduce(
                    (cnt, item) => item.status === 1 ? ++cnt : cnt, 0);

                await storyDao.updateMany({ status: 1 }, { status: 0 }, expectUpdateCount);

                const afterStoryList = await storyDao.getList();
                const afterLength = afterStoryList.length;

                assert.equal(afterLength, beforeLength);

                const afterStoryObj = _.keyBy(afterStoryList, 'storyId');
                for (const item of beforeStoryList) {
                    const compareItem = afterStoryObj[item.storyId];
                    assert.isNotNull(compareItem);
                    assert.equal(compareItem.storyId, item.storyId);
                    assert.equal(compareItem.status, 0);
                }
            });

            it('update all', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                await storyDao.insert(new Story({ storyId: 'updateAllId', status: 0 }));
                await storyDao.updateAll({ status: 1 });

                const afterStoryList = await storyDao.getList();
                const afterLength = afterStoryList.length;

                assert.equal(beforeLength + 1, afterLength);

                for (const item of afterStoryList) {
                    assert.equal(item.status, 1);
                }
            })
        })

        describe('delete', () => {
            it('deleteOne', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                const insertStory = new Story({ storyId: 'deleteTestId', status: 1 });
                await storyDao.insert(insertStory);

                let afterStoryList = await storyDao.getList();
                let afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength + 1);

                await storyDao.deleteOne(insertStory);

                afterStoryList = await storyDao.getList();
                afterLenght = afterStoryList.length;

                assert.equal(afterLenght, beforeLength);

                let filteredItem = afterStoryList.filter((item) => item.storyId == insertStory.storyId);
                assert.equal(filteredItem.length, 0);
            });

            it('deleteAll', async () => {
                const beforeStoryList = await storyDao.getList();
                const beforeLength = beforeStoryList.length;

                assert.notEqual(beforeLength, 0);
                await storyDao.deleteAll();

                const afterStoryList = await storyDao.getList();
                const afterLength = afterStoryList.length;

                assert.equal(afterLength, 0);
            })
        })
    });

    async function beforeExeption() {
        const idList = ['storyId1', 'storyId2', 'storyId3', 'storyId4', 'storyId5', 'storyId6'];

        for (const item of idList) {
            await storyDao.insert(new Story({ storyId: item, status: 1 }));
        }
    }

    async function afterException() {
        await storyDao.deleteAll();
    }

    describe('exception', () => {
        before(async () => {
            await beforeExeption();
        });

        after(async () => {
            await afterException();
        })

        describe('getOne', () => {
            it('throw noExistAllowWhereField', async () => {
                try {
                    await storyDao.getOne({})
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
                    TestHelper.isSameError(err, expectError);
                }
            });

            it('throw getOneLength', async () => {
                try {
                    await storyDao.getOne({ status: 1 });
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.getOneLength);
                    TestHelper.isSameError(err, expectError);
                }
            });

            it('throw getOneLength', async () => {
                try {
                    const idList = ['getOneExceptionId1', 'getOneExceptionId2', 'getOneExceptionId3'];
                    const storyList = [];
                    for (const item of idList) {
                        storyList.push(new Story({ storyId: item, status: 0 }));
                    }

                    await storyDao.insertMany(storyList);
                    await storyDao.getOne({ status: 0 });
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.getOneLength);
                    TestHelper.isSameError(expectError, err);
                }
            })
        })

        describe('updateMany', () => {
            before(async () => {
                const storyList = await storyDao.getList();
            })

            it('throw updateManyCount', async () => {
                try {
                    const idList = ['updateMnayExceptionId1',
                        'updateMnayExceptionId2',
                        'updateMnayExceptionId3'];

                    const itemList = [];
                    for (const item in idList) {
                        itemList.push(new Story({ storyId: item, status: 1 }));
                    }

                    await storyDao.insertMany(itemList);
                    await storyDao.updateMany({ status: 1 }, { status: 0 }, idList.length + 1);
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.updateManyCount);
                    TestHelper.isSameError(err, expectError);
                }
            });

            it('throw noExistAllowWhereField', async () => {
                try {
                    const beforeStoryList = await storyDao.getList();
                    const beforeLength = beforeStoryList.length;
                    
                    await storyDao.updateMany({ status1: 1 }, { status1: 0 });
                    throw new Error('need exception');
                } catch(err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
                    TestHelper.isSameError(err, expectError);
                }
            });

            it('throw setCantBeNull', async () => {
                try {
                    await storyDao.updateMany({ storyId: 'setCantBeNull' });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.setCantBeNull);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw notAllowSetField', async () => {
                try {
                    await storyDao.updateMany(
                        { storyId: 'setNoExistDataId1' },
                        { storyId: 'setNoExistDataId2' });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.notAllowSetField);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw noAffectedField', async () => {
                try {
                    await storyDao.updateMany(
                        { storyId: 'setNoExistDataId1' },
                        { sadfasdfasdf: 'test' });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.noAffectedField);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw setValidValue status', async () => {
                try {
                    await storyDao.updateMany(
                        { storyId: 'setNoExistDataId1' },
                        { status: 999 });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.setValidValue);
                    TestHelper.isSameError(expectError, err);
                }
            });
        });

        describe('insert', () => {
            it('throw requireInsertField Story - storyId', async () => {
                try {
                    await storyDao.insert({ status: 1 });
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.requireInsertField);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw requireInsertField Story - status', async () => {
                try {
                    await storyDao.insert({ storyId: 'insertNeedDataId1' });
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.requireInsertField);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw setValidValue status', async() => {
                try {
                    await storyDao.insert({ storyId: 'test', status: 3 });
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.setValidValue);
                    TestHelper.isSameError(expectError, err);
                }
            })
        })

        describe('updateOne', () => {
            it('throw updateOneCount', async () => {
                try {
                    const idList = ['updateOneExceptionId1', 'updateOneExceptionId2', 'updateOneExceptionId3'];
                    const storyList = [];
                    for (const item of idList) {
                        storyList.push(new Story({ storyId: item, status: 0 }));
                    }

                    await storyDao.insertMany(storyList);
                    await storyDao.updateOne({ status: 0 }, { status: 1 });
                    throw new Error('need exception!');
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.updateOneCount);
                    TestHelper.isSameError(err, expectError);
                }
            });
            
            it('throw noExistAllowWhereField', async () => {
                try {
                    await storyDao.updateOne({});
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.noExistAllowWhereField);
                    TestHelper.isSameError(expectError, err);
                }
            });


            it('throw setCantBeNull', async () => {
                try {
                    await storyDao.updateOne({ storyId: 'setCantBeNull' });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.setCantBeNull);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw notAllowSetField', async () => {
                try {
                    await storyDao.updateOne(
                        { storyId: 'setNoExistDataId1' },
                        { storyId: 'setNoExistDataId2' });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.notAllowSetField);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw noAffectedField', async () => {
                try {
                    await storyDao.updateOne(
                        { storyId: 'setNoExistDataId1' },
                        { sadfasdfasdf: 'test' });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.noAffectedField);
                    TestHelper.isSameError(expectError, err);
                }
            });

            it('throw setValidValue status', async () => {
                try {
                    await storyDao.updateOne(
                        { storyId: 'setNoExistDataId1' },
                        { status: 999 });
                } catch (err) {
                    const expectError = new SSError.Dao(SSError.Dao.Code.setValidValue);
                    TestHelper.isSameError(expectError, err);
                }
            });
        })
    })
});


