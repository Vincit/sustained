const { ConnectionSource } = require('./ConnectionSource');

class SingleConnectionSource extends ConnectionSource {
  constructor({ connection }) {
    super();
    this.connection = connection;
  }

  acquire() {
    return Promise.resolve(connection);
  }

  release(connection) {
    return Promise.resolve();
  }

  destroy() {
    return Promise.resolve();
  }
}

module.exports = {
  SingleConnectionSource
};
