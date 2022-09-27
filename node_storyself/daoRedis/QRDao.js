const sessionExpire = 60 * 3;

class QRDao {
  constructor(connection) {
    this.connection = connection.redis;
  }

  async set(confirmKey, user) {
    await this.connection.set(`${this.generateKey(confirmKey)}`, JSON.stringify(user), 'ex', sessionExpire);
  }

  async del(confirmKey) {
    await this.connection.del(`${this.generateKey(confirmKey)}`);
  }

  async get(confirmKey) {
    const user = JSON.parse(await this.connection.get(`${this.generateKey(confirmKey)}`));
    return user;
  }

  generateKey(confirmKey) {
    return `ktlink:${confirmKey}`
  }
}

module.exports = QRDao;