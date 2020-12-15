require('../apps/startup');
const supertest = require('supertest');

let app = null;
let request = null;
let server = null;

before(async () => {
    await require('../apps/api-server/boot/initSS')();
    app = await require('../apps/api-server/boot/initHttp').initKoa();
    server = app.listen();
    request = supertest(server);
});

after(() => {
    server.close();
})

describe('Array', function() {
    describe('#indexOf()', () => {
        it('test1', async () => {
            await request.get('/config').expect(200);
        })

        it('test2', async () => {
            await request.get('/story/list').expect(200);
        })
    })
})