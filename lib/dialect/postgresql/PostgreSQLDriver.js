const { Driver } = require('../../driver/Driver');
const { PostgreSQLConnection } = require('./PostgreSQLConnection');

class PostgreSQLDriver extends Driver {
  constructor(opt) {
    super();

    this.pg = opt.pg;
    this.connectionConfig = opt.connectionConfig;
  }

  createConnection() {
    const client = new this.pg.Client(this.connectionConfig);
    const connection = new PostgreSQLConnection(client);
    return client.connect().then(() => connection);
  }

  validateConnection(connection) {
    return true;
  }

  destroyConnection(connection) {
    return connection.client.end();
  }
}

module.exports = {
  PostgreSQLDriver
};
