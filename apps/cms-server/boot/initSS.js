const ss = require('@ss');
const mongo = require('@ss/dbMongo');
const helper = require('@ss/helper');
const wrapper = require('@ss/wrapper');
const dbRedisSS = require('@ss/dbRedisSS');
const dbRedisPB = require('@ss/dbRedisPB');

module.exports = async () => {
    await ss.configs.ready();
    await helper.ready();
    await mongo.ready();
    await dbRedisSS.ready();
    await dbRedisPB.ready();
    await wrapper.ready();
};