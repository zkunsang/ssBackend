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

  pushMessage = async (to, title, body) => {
    const _body = {
      to,
      "notification": {
        title,
        body,
      },
      "data": {
        title,
        body
      }
    }

    const result = await fetch("https://fcm.googleapis.com/fcm/send", { method: 'post', body: JSON.stringify(_body), headers: this.headers });
    console.log(await result.text());
  }
}

module.exports = new FCMUtil();