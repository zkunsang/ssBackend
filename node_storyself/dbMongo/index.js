const MongoClient = require('mongodb').MongoClient;

const ss = require('../index');
const helper = require('../helper');

class Mongo {
    constructor() {
        console.log('mongo constructor');
        this.userConnect = null;
        this.storyConnect = null;
    }

    async ready() {
        try {
            this.userConnect = await this.setUserConnect(ss.configs.dbMongoUser);
            this.storyConnect = await this.setDataConnect(ss.configs.dbMongoData);
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }

    async setUserConnect(dbMongo) {
        const url = `mongodb://${dbMongo.host}:${dbMongo.port}`;
        return await MongoClient.connect(url, { useUnifiedTopology: true, ignoreUndefined: true });
    }

    async setDataConnect(dbMongo) {
        const url = `mongodb://${dbMongo.host}:${dbMongo.port}`;
        return await MongoClient.connect(url, { useUnifiedTopology: true, ignoreUndefined: true });
    }
}

module.exports = new Mongo();