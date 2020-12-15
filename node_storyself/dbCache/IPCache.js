const dbMongo = require('../dbMongo');
const IPDao = require('../daoMongo/IPDao');

const IP = require('../models/mongo/IP');

const Cache = require('./Cache');
const _ = require('lodash');

const tableId = 'ip';

class IpModel {
    constructor() {
        this.ipList = null;
        this.whiteList = [];
        this.blackList = [];
        this.whiteMap = {};
        this.blackMap = {};
    }

    async loadData(ipDao) {
        this.ipList = await ipDao.findAll();

        for(const ip of this.ipList) {
            if (ip.status !== 1) continue;
            const isWhiteIp = ip.type ==  'white';
            
            if(isWhiteIp) this.whiteList.push(ip);
            else this.whiteList.push(ip);
        }
        

        this.parseIP();
    }

    parseIP() {
        this.whiteMap = _.keyBy(this.whiteList, IP.Schema.IP.key);
        this.blackMap = _.keyBy(this.blackList, IP.Schema.IP.key);
    }

    getWhiteIP(ip) {
        return this.whiteMap[ip];
    }

    getBlackIP(ip) {
        return this.blackMap[ip];
    }
}

class IpCache extends Cache {
    constructor() {    
        super();
        this.cacheModel = IpModel;
        this.tableId = tableId;
    }   
    
    async ready() {
        this.dao = new IPDao(dbMongo);
    }

    getWhiteIP(ip) {
        return this.currentCacheModel.getWhiteIP(ip);
    }
    
    getBlackIP(ip) {
        return this.currentCacheModel.getBlackIP(ip);
    }
}

module.exports = new IpCache();