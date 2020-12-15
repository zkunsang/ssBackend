const AdminDao = require('../daoMongo/AdminDao');
const ResourceDao = require('../daoMongo/ResourceDao');
const StoryDao = require('../daoMongo/StoryDao');
const UserDao = require('../daoMongo/UserDao');

const Wrapper = require('./wrapper')
const SSError = require('../error');

class DaoWrapper extends Wrapper {
    constructor() { 
        super(); 
        this.initiated = false;
    }

    init() {
        if(this.initiated) return;
        
        this.tryCatchWrapper(StoryDao.prototype, this.execute);
        this.tryCatchWrapper(AdminDao.prototype, this.execute);
        this.tryCatchWrapper(ResourceDao.prototype, this.execute);
        this.tryCatchWrapper(UserDao.prototype, this.execute);

        this.initiated = true;
    }

    async execute(fn, ...args) {
        try {
            return await fn.call(this, ...args);;
        } catch (err) {
            if(err instanceof SSError.RunTime) {
                // helper.slack.sendMessage(err.makeErrorMessage());
                throw err
            } else {
                // helper.slack.sendMessage(err);
                throw new SSError.Uncaught(err);
            }
        }
    }
}

module.exports = DaoWrapper;