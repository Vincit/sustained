const { ConnectionFactory } = require('./ConnectionFactory');

class PoolingConnectionFactory {
  constructor({ driver }) {
    this.driver = driver;
  }

  acquire() {}

  release(connection) {}
}

module.exports = {
  PoolingConnectionFactory
};
