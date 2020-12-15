const dbMongo = require('@ss/dbMongo');
const AdminDao = require('@ss/daoMongo/AdminDao');
const ReqAuthRegist = require('@ss/models/cmsController/ReqAuthRegist');
const Admin = require('@ss/models/mongo/Admin');
const AdminStatus = Admin.AdminStatus;
const AdminRole = Admin.AdminRole;

module.exports = async (ctx, next) => {
    const createDate = ctx.$date;
    const reqAuthRegist = new ReqAuthRegist(ctx.request.body);
    ReqAuthRegist.validModel(reqAuthRegist);

    const adminDao = new AdminDao(dbMongo);
    const admin = new Admin(reqAuthRegist);
    admin.setAdminRole(AdminRole.NONE);
    admin.setStatus(AdminStatus.PENDING);
    admin.setCreateDate(createDate);

    const adminId = admin.getAdminId();
    const adminInfo = await adminDao.findOne({adminId});

    if(adminInfo) {
        ctx.status = 400;
        ctx.body.data = { err_message: 'already exist user' };
        return await next();
    }

    await adminDao.insertOne(admin);
    ctx.status = 200;
    ctx.body.data = {};
    return await next();
};

