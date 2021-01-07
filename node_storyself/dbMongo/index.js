const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');

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
            this.userConnect = await this.setConnect(ss.configs.dbMongoUser);
            this.storyConnect = await this.setConnect(ss.configs.dbMongoData);
        }
        catch (err) {
            console.log(err);
            helper.slack.sendMessage(err);
        }
    }

    async setConnect(dbMongo) {
        const url = dbMongo.host;
        const sslCrt = dbMongo.sslCrt;
        const options = { useUnifiedTopology: true, ignoreUndefined: true };
        if (sslCrt) {
            const ca = [fs.readFileSync(sslCrt)];
            options.useFindAndModify = false;
            options.retryWrites = false;
            options.sslValidate = true;
            options.sslCA = ca;
            options.useNewUrlParser = true;
            options.useUnifiedTopology = true;
        }

        return await MongoClient.connect(url, options);
    }
}

module.exports = new Mongo();
