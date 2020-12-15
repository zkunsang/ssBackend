process.on('uncaughtException', (err) => console.error(err));
require('../startup');

(async () => {
    try {
        await require('./boot/initSS')();
        await require('./boot/initHttp')();
    } catch (error) {
        console.error(error);
        process.exit();
    }
})();