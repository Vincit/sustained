import pg from 'pg'

import { QueryBuilder, PoolingConnectionSource } from '../../src'
import {
  Compiler as PostgreSQLQueryCompiler,
  Driver as PostgreSQLDriver,
} from '../../src/dialect/postgresql'

describe('integration tests', () => {
  const compiler = new PostgreSQLQueryCompiler()

  const driver = new PostgreSQLDriver({
    pg,
    connectionConfig: {
      database: 'objection_test',
      user: 'objection',
    },
  })

  const connectionSource = new PoolingConnectionSource({ driver, poolConfig: { min: 0, max: 10 } })

  it('my first real query', () => {
    const query = new QueryBuilder()

    return query
      .from('Model1')
      .select('*')
      .where('model1Prop1', 'hello 5')
      .execute({
        compiler,
        connectionSource,
      })
      .then((rows) => {
        console.log(rows)
      })
  })

  it('my second real query', () => {
    const query = new QueryBuilder({
      compiler,
      connectionSource,
    })

    return query
      .from('Model1')
      .select('Model1.*')
      .whereIn('Model1.id', [1, 2, 3])
      .leftJoin('Model1 as m', 'm.id', 'Model1.model1Id')
      .orderBy('Model1.id')
      .then((rows) => {
        console.log(rows)
      })
  })

  after(() => {
    return connectionSource.destroy()
  })

  after(() => {
    return driver.destroy()
  })
})
