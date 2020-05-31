import { ConnectionSource } from './ConnectionSource'

class SingleConnectionSource extends ConnectionSource {
  constructor({ connection }) {
    super()
    this.connection = connection
  }

  acquireConnection() {
    return Promise.resolve(connection)
  }

  releaseConnection(connection) {
    return Promise.resolve()
  }

  destroy() {
    return Promise.resolve()
  }
}

export { SingleConnectionSource }
