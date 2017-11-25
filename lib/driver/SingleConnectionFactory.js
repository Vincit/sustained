const { ConnectionFactory } = require('./ConnectionFactory');

class SingleConnectionFactory {
  constructor({ connection }) {
    this.connection = connection;
  }

  acquire() {
    return Promise.resolve(connection);
  }

  release(connection) {
    // Do nothing.
  }
}

module.exports = {
  SingleConnectionFactory
};
