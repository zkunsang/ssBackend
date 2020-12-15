const DaoWrapper = require('./daoWrapper');

class Wrapper {
    constructor() {
        this.daoWrapper = null;
    }

    async ready() {
        try {
            if(!this.daoWrapper) { 
                this.daoWrapper = new DaoWrapper(); 
                this.daoWrapper.init();
            }
        }
        catch (err) {
            helper.slack.sendMessage(err);
        }
    }
}

module.exports = new Wrapper();