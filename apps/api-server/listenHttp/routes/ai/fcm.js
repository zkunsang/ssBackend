const FCMUtil = require('@ss/util/FcmUtil');

const generateMessage = (language) => {
    if(language == "kr") {
        const body = "어서 들어오세요"
        const title = "스티커 생성이 완료되었습니다."
        return [body, title];
    }

    const body = "come on"
    const title = "generate finished"
    return [body, title];
}


module.exports = async (ctx, next) => {
    const to = "cDWuTTOtRzu-5VquIqTcpP:APA91bGPkFuS4zaYP-zVJkBdk_0i7z1oTEo2r9BewOSjTUYI8GyBSW2S3mceupRT8rlUC92aACOaw2jR0wvNGeTJUeG5TgE9KsGQi4dMQqpvGqFLdjTK-7o0LfkYdYounC9-s2HZ-njj"
    const [title, body] = generateMessage("en");
    
    await FCMUtil.pushMessage(to, title, body)

    ctx.$res.success({});

    await next();
}
