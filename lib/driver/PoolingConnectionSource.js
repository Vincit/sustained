const { ConnectionSource } = require('./ConnectionSource');
const { Pool } = require('tarn');

class PoolingConnectionSource extends ConnectionSource {
  constructor({ driver, poolConfig }) {
    super();

    this.driver = driver;
    this.pool = new Pool(
      Object.assign({}, poolConfig, {
        create: () => {
          return this.driver.createConnection();
        },

        validate: connection => {
          return this.driver.validateConnection(connection);
        },

        destroy: connection => {
          this.driver.destroyConnection(connection);
        }
      })
    );
  }

  acquire() {
    return this.pool.acquire().promise;
  }

  release(connection) {
    this.pool.release(connection);
    return Promise.resolve();
  }

  destroy() {
    return this.pool.destroy();
  }
}

module.exports = {
  PoolingConnectionSource
};
