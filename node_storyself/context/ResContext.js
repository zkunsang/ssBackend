const crypto = require('crypto');
const SSError = require('@ss/error');
const ServiceVariableCache = require('@ss/dbCache/ServiceVariableCache');
const ServiceVariable = require('@ss/models/mongo/ServiceVariable');
const VariableKey = ServiceVariable.VariableKey;


const UNAUTH_TYPE = {
    NO_EXIST_SESSION: 2,

}

class ResContext {
    constructor(ctx) {
        this.ctx = ctx;
        this.ctx.body = {};
        this.ctx.body.common = {}
        const aosVersion = ServiceVariableCache.get(VariableKey.aosAppVersion);
        const iosVersion = ServiceVariableCache.get(VariableKey.iosAppVersion);
        this.ctx.body.common.aosAppVersion = aosVersion ? aosVersion.value : null;
        this.ctx.body.common.iosAppVersion = iosVersion ? iosVersion.value : null;
        this.ctx.body.common.serverTime = ctx.$date;
    }

    badRequest(errorCode) {
        // return this.ctx.throw(400);
        throw new SSError.Service(errorCode);
        
    }

    serviceUnavailable(code, message) {
        throw new SSError.Service(code, message);
    }

    internalServerError() {
        // return this.ctx.throw(500);
    }

    unauthorized(errorCode) {
        throw new SSError.Service(errorCode);
        // return this.ctx.throw(400);
    }

    forbidden(failType, failMsg) {
        // return this.ctx.throw(403);
    }

    encrypt() {
        if (this.ctx.body !== undefined) {
            const cipherKey = 'cipher';
            const iv = 'cipher';
            const cipher = crypto.createCipheriv('aes-256-cbc', cipherKey, iv);
            let enc = cipher.update(this.ctx.body);
            this.ctx.body = Buffer.concat([enc, cipher.final()]);
        }
    }

    set(data) {
        this.ctx.body.data = data;
    }

    addData(data) {
        this.ctx.body.data = {...this.ctx.body.data, ...data};
    }

    success(data) {
        if(data) {
            this.ctx.body.data = {...this.ctx.body.data, ...data};
        }   
    }

    setResultCode(resultCode) {
        this.ctx.body.resultCode = resultCode;
    }

    setCookie(name, value, options) {
        console.log(name, value, options);
        this.ctx.cookies.set(name, value, options)
    }

    setSessionCookie(value) {
        this.setCookie('sessionId', value, { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true, path:"/login"});
    }
}

module.exports = ResContext;
module.exports.UNAUTH_TYPE = UNAUTH_TYPE; 