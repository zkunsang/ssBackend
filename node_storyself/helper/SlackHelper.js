const { IncomingWebhook } = require('@slack/webhook');
const ss = require('../index.js');

class SlackHelper {
    constructor() {
        this.webhook = null;
        this.slackConfig = null;
    }

    async ready() {
        this.slackConfig = ss.configs.slack;
        if (!this.slackConfig.useSlack) return;
        this.webhook = new IncomingWebhook(this.slackConfig.webhookUrl);
    }

    sendMessage(message) {
        if (!this.slackConfig.useSlack) return;
        try {
            this.webhook.send(`[${process.env.NODE_ENV}]\n${message}`)
        }
        catch (err) {
            console.error('slack error', err);
        }
    }
}

module.exports = new SlackHelper();
