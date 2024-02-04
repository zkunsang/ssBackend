const ss = require("@ss");
const fetch = require('node-fetch');

class FCMUtil {
  constructor() {

  }

  init() {
    this.headers = {
      Authorization: ss.configs.apiServer.Authorization,
      "Content-Type": "application/json"
    }
  }

  pushMessage = async (to, title, body, tag) => {
    const topic = "topic"
    
    // const condition = '\'stock-GOOG\' in topics || \'industry-tech\' in topics';

    const _body = {
      to,
      "notification": {
        title,
        body,
        tag
      },
      "data": {
        title,
        body,
        tag
      },
      topic,
    }

    const result = await fetch("https://fcm.googleapis.com/fcm/send", { method: 'post', body: JSON.stringify(_body), headers: this.headers });
    console.log(await result.text());
  }
}

module.exports = new FCMUtil();