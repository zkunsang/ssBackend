const SlackHelper = require('./SlackHelper');
const FluentdHelper = require('./FluentdHelper');

class Helper {
    constructor() {
        this.slack = SlackHelper;
        this.fluent = FluentdHelper; 
    }

    async ready() {
        await this.slack.ready();
        await this.fluent.ready();
        
    }
};

module.exports = new Helper();