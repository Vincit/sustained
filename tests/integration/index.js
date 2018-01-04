const { expect } = require('chai');
const { QueryBuilder, PoolingConnectionSource } = require('../../');

const pg = require('pg');
const {
  Compiler: PostgreSQLQueryCompiler,
  Driver: PostgreSQLDriver
} = require('../../lib/dialect/postgresql');

describe('integration tests', () => {
  const compiler = new PostgreSQLQueryCompiler();

  const driver = new PostgreSQLDriver({
    pg,
    connectionConfig: {
      database: 'objection_test'
    }
  });

  const connectionSource = new PoolingConnectionSource({ driver, poolConfig: { min: 0, max: 10 } });

  it('my first real query', () => {
    const query = new QueryBuilder();

    return query
      .from('Model1')
      .select('*')
      .where('model1Prop1', 'hello 5')
      .execute({
        compiler,
        connectionSource
      })
      .then(rows => {
        console.log(rows);
      });
  });

  it('my second real query', () => {
    const query = new QueryBuilder({
      compiler,
      connectionSource
    });

    return query
      .from('Model1')
      .select('*')
      .whereIn('id', [1, 2, 3])
      .orderBy('id')
      .then(rows => {
        console.log(rows);
      });
  });

  after(() => {
    return connectionSource.destroy();
  });

  after(() => {
    return driver.destroy();
  });
});
