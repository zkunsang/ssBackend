const { ask } = require('@ss/util/chatGPTUtil');

module.exports = async (ctx, next) => {
    // 데이터 버젼 테이블만 내려 받는 형식으로 변경
    const { data } = ctx.request.body;

    const content = await ask(data);
    ctx.$res.addData({ content });
    ctx.$res.success();
    
    await next();
}