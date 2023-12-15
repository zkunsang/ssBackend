const SlackHelper = require('./SlackHelper');
const FluentdHelper = require('./FluentdHelper');
const FCMUtil = require('./../../node_storyself/util/FcmUtil')

class Helper {
    constructor() {
        this.slack = SlackHelper;
        this.fluent = FluentdHelper; 
    }

    async ready() {
        await this.slack.ready();
        await this.fluent.ready();
        FCMUtil.init();
    }
};

module.exports = new Helper();