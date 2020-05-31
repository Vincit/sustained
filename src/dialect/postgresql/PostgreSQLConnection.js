import { Connection } from '../../driver/Connection'

export class PostgreSQLConnection extends Connection {
  constructor(client) {
    super()
    this.client = client
  }

  execute(compiledQuery) {
    const { sql, bindings } = compiledQuery
    return this.client.query(sql, bindings).then((result) => result.rows)
  }

  connect() {
    return this.client.connect().then(() => this)
  }

  destroy() {
    return this.client.end()
  }
}
