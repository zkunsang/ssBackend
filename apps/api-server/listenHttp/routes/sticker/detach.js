const ss = require('@ss');


module.exports = async (ctx, next) => {
    // 데이터 버젼 테이블만 내려 받는 형식으로 변경

    await next();

}