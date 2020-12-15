const fs = require('@ex/fs');
const KoaRouter = require('@koa/router');

module.exports = class Router extends KoaRouter {
    mapping(path, fn, fnChangeRouteName) {
        if (!fs.existsSync(path))
            return;

        path = fs.realpathSync(path);
        let files = fs.globSync(path, '**/*.js');

        let repeaterFiles = files.filter(m => (m.substr(-4) === '_.js'));
        let apiFiles = files.filter(m => (m.substr(-4) !== '_.js'));

        for (let file of repeaterFiles) {
            let mod = require(path + '/' + file);
            let middleware = null;

            if (typeof mod === 'object' && 'onRoute' in mod)
                middleware = mod.onRoute;
            else if (typeof mod === 'function')
                middleware = mod;

            if (middleware === null)
                continue;
 
            let route = '/' + file.substr(0, file.length - 5);
            if (typeof fnChangeRouteName === 'function')
                route = fnChangeRouteName(route);

            this.use(route, middleware);
        }

        for (let file of apiFiles) {
            let mod = require(path + '/' + file);
            let middleware = null;

            if (typeof mod === 'object' && 'onRoute' in mod)
                middleware = mod.onRoute;
            else if (typeof mod === 'function')
                middleware = mod;

            if (middleware === null)
                continue;

            let route = '/' + file.substr(0, file.length - 3);
            if (typeof fnChangeRouteName === 'function')
                route = fnChangeRouteName(route);

            this.all(route, middleware);
        }

        for (let file of repeaterFiles) {
            let mod = require(path + '/' + file);
            let middleware = null;

            if (typeof mod === 'object' && 'onAfter' in mod)
                middleware = mod.onAfter;

            if (middleware === null)
                continue;

            if (typeof fn === 'function')
                middleware = fn(middleware);

            let route = '/' + file.substr(0, file.length - 5);
            if (typeof fnChangeRouteName === 'function')
                route = fnChangeRouteName(route);

            this.use(route, middleware);
        }

        for (let file of apiFiles) {
            let mod = require(path + '/' + file);
            let middleware = null;

            if (typeof mod === 'object' && 'onAfter' in mod)
                middleware = mod.onAfter;

            if (middleware === null)
                continue;

            if (typeof fn === 'function')
                middleware = fn(middleware);

            let route = '/' + file.substr(0, file.length - 3);
            if (typeof fnChangeRouteName === 'function')
                route = fnChangeRouteName(route);

            this.use(route, middleware);
        }
    }
}