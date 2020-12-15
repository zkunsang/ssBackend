const http = require('http');
const Koa = require('koa');
const koaBodyParser = require('koa-bodyparser');
const KoaRouter = require('@ex/koa-router');
const Cors = require('@koa/cors');
const ss = require('@ss');

module.exports = async () => {
    const koa = new Koa();

    let path = __dirname + '/../listenHttp';

    const router = new KoaRouter();
    router.use(Cors());
    router.use(koaBodyParser());

    router.mapping(path + '/routes');
    koa.use(router.routes());

    koa.on('error', (err) => {
        console.error(err);
    });

    http.createServer(koa.callback()).listen(ss.configs.apiServer.port, () => {
        console.info('Listen API Server OK => ' + 'http:' + ss.configs.apiServer.port);
    });
};