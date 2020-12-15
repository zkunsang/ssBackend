const dbMongo = require('@ss/dbMongo');
const UmsAdminDao = require('@ss/daoMongo/UmsAdminDao');
const ReqAuthRegist = require('@ss/models/umsController/ReqAuthRegist');
const Admin = require('@ss/models/mongo/Admin');
const AdminStatus = Admin.AdminStatus;
const AdminRole = Admin.AdminRole;

module.exports = async (ctx, next) => {
    const createDate = ctx.$date;
    const reqAuthRegist = new ReqAuthRegist(ctx.request.body);
    ReqAuthRegist.validModel(reqAuthRegist);

    const umsAdminDao = new UmsAdminDao(dbMongo);
    const admin = new Admin(reqAuthRegist);
    admin.setAdminRole(AdminRole.NONE);
    admin.setStatus(AdminStatus.PENDING);
    admin.setCreateDate(createDate);

    const adminId = admin.getAdminId();
    const adminInfo = await umsAdminDao.findOne({adminId});

    if(adminInfo) {
        ctx.status = 400;
        ctx.body.data = { err_message: 'already exist user' };
        return await next();
    }

    await umsAdminDao.insertOne(admin);
    ctx.status = 200;
    ctx.body.data = {};
    return await next();
};

