const { Connection } = require('../../driver/Connection');

class PostgreSQLConnection extends Connection {
  constructor(client) {
    super();
    this.client = client;
  }

  execute(compiledQuery) {
    console.log('PostgreSQLConnection.execute');
    return this.client.query(compiledQuery.sql, compiledQuery.bindings).then(result => {
      return result.rows;
    });
  }
}

module.exports = {
  PostgreSQLConnection
};
