const os = require('os');
const crypto = require('crypto');
const ipaddr = require('ipaddr.js');

class ReqContext {
    constructor(ctx) {
        this.date = new Date();
        this.route = ctx.URL.pathname;
        this.method = ctx.method;
	ctx.request.ip = ctx.request.headers['x-forwarded-for'] || ctx.request.ip;
        
        this.clientIp = this.getClientIp(ctx.request.ip);
        // this.serverIp = ipaddr.process(this.getServerIp()).toNormalizedString();

        this.body = (this.method === 'POST') ? ctx.request.body : ctx.request.query;
        this.body = (typeof this.body !== 'undefined') ? this.body : {};
    }

    getClientIp(ip) {
        let clientIp = null;

        try {
            clientIp = ipaddr.process(ip).toNormalizedString();
        } catch(e) {
            clientIp = ip;
        }

        return clientIp;
    }

    // getServerIp() {
    //     let interfases = os.networkInterfaces();
    //     let result = '';
    //     for (let k in interfases) {
    //         interfases[k].forEach(m => {
    //             if (m.family == 'IPv4' && m.internal === false) result = m.address;
    //         });
    //     }
    //     return result;
    // }

    decrypt(encoding = undefined) {
        if (encoding)
            this.body = Buffer.from(this.body, encoding);   

        const cipherKey = 'cipher';
        const iv = 'cipher';
        const decipher = crypto.createDecipheriv('aes-256-cbc', cipherKey, iv);
        let dec = decipher.update(this.body);
        this.body = Buffer.concat([dec, decipher.final()]);
    }
}

module.exports = ReqContext;
