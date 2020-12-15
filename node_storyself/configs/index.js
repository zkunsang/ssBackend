const path = require('path');


module.exports = class Config {
    constructor(configPath) {
        this.configPath = configPath;
    }

    ready() {
        let msg = 'configs: [' + this.configPath + '] ';
        try {
            const configInfo = require(`@cf/${this.configPath}/configList.json`);
            this.setConfig(configInfo);
        } catch (e) {
            throw msg + e.message;
        }

        console.log(msg + 'ready');
    }

    setConfig(configList) {
        for(const config of configList) {
            this[config] = require(`@cf/${this.configPath}/${config}.json`)
        }
    }
}