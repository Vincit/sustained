import { Driver } from '../../driver/Driver'
import { PostgreSQLConnection } from './PostgreSQLConnection'

export class PostgreSQLDriver extends Driver {
  constructor(opt) {
    super()

    this.pg = opt.pg
    this.connectionConfig = opt.connectionConfig
  }

  createConnection() {
    const client = new this.pg.Client(this.connectionConfig)
    const connection = new PostgreSQLConnection(client)
    return connection.connect()
  }

  validateConnection(connection) {
    return true
  }

  destroyConnection(connection) {
    return connection.destroy()
  }

  destroy() {
    return Promise.resolve()
  }
}
