const fs = require('@ex/fs');
const ss = require('@ss');
const apiConfig = ss.configs.apiServer;
const swagger = require('swagger-koa');

module.exports = {
    routes(path) {
        path = fs.realpathSync(path);
        let files = fs.globSync(path, '**/*.js');
        let apis = files.filter(m => (m.substr(-4) !== '_.js'));
        apis = apis.map(m => `${path}/${m}`);

        const basePath = process.env.NODE_ENV === 'apiDev' ? `${apiConfig.apiUrl}`: `${apiConfig.apiUrl}:${apiConfig.port}`
        return swagger.init({
            apiVersion: '1.0',
            swaggerVersion: '1.0',
            swaggerURL: '/swagger',
            swaggerJSON: '/api-docs.json',
            swaggerUI: './public/swagger/',
            basePath: basePath,
            info: {
                title: 'swagger-koa sample app',
                description: 'Swagger + Koa = {swagger-koa}'
            },
            apis
        })
    }
}