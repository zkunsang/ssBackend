const ReqResourceUpdateMany = require("@ss/models/cmsController/ReqResourceUpdateMany");

const moment = require("moment");

const TZResourceDao = require("@ss/daoMongo/TZResourceDao");

async function insertResourceList(resourceDao, resourceList, updateDate) {
  const insertResourceList = TZResourceDao.mappingList(resourceList);
  for (const resource of insertResourceList) {
    resource.setUpdateDate(updateDate);
    resource.crc32 = resource.crc32.toString();
  }

  await resourceDao.insertMany(insertResourceList);
}

module.exports = async (ctx, next) => {
  const updateDate = moment().unix();
  const reqResourceUpdateMany = new ReqResourceUpdateMany(ctx.request.body);
  ReqResourceUpdateMany.validModel(reqResourceUpdateMany);

  const resourceList = reqResourceUpdateMany.getResourceList();
  const resourceDao = new TZResourceDao(ctx.$dbMongo);

  await resourceDao.deleteAll();
  await insertResourceList(resourceDao, resourceList, updateDate);

  ctx.status = 200;
  ctx.body.data = {};
  await next();
};
