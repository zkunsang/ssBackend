const ss = require('@ss');

const dbMongo = require('@ss/dbMongo');
const helper = require('@ss/helper');
const wrapper = require('@ss/wrapper');
const dbRedisSS = require('@ss/dbRedisSS');
const dbRedisPB = require('@ss/dbRedisPB');
const cache = require('@ss/dbCache');


module.exports = async () => {
    await ss.configs.ready();
    await helper.ready();
    await dbMongo.ready();
    await dbRedisSS.ready();
    await dbRedisPB.ready();
    await wrapper.ready();
    await cache.ready();
};