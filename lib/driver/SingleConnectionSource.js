const { ConnectionSource } = require('./ConnectionSource');

class SingleConnectionSource extends ConnectionSource {
  constructor({ connection }) {
    super();
    this.connection = connection;
  }

  acquireConnection() {
    return Promise.resolve(connection);
  }

  releaseConnection(connection) {
    return Promise.resolve();
  }

  destroy() {
    return Promise.resolve();
  }
}

module.exports = {
  SingleConnectionSource
};
