module.exports = async (ctx, next) => {
    
    const userInfo = ctx.$userInfo;

    const { mail, inventory } = userInfo;
    
    ctx.$res.success({ mail: Object.values(mail), inventory });
    
    await next();
}
