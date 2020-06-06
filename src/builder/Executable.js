import { asyncTry } from '../utils/promiseUtils'

// Makes a given OperationBuilder subclass executable by adding
// methods to compile SQL and execute the query.
export const Executable = (AnyOperationBuilder) => {
  return class extends AnyOperationBuilder {
    constructor(args = {}) {
      super(args)

      this.compiler = args.compiler || null
      this.connectionSource = args.connectionSource || null
    }

    toSQL({ compiler } = {}) {
      compiler = compiler || this.compiler
      return compiler.compile(this.operationNode)
    }

    execute({ compiler, connectionSource } = {}) {
      connectionSource = connectionSource || this.connectionSource
      const compiledQuery = this.toSQL({ compiler })

      return connectionSource.acquireConnection().then((connection) => {
        return asyncTry(() => connection.execute(compiledQuery))
          .then((result) => {
            return connectionSource.releaseConnection(connection).then(() => result)
          })
          .catch((err) => {
            return connectionSource.releaseConnection(connection).then(() => Promise.reject(err))
          })
      })
    }

    clone() {
      const clone = super.clone()

      clone.compiler = this.compiler
      clone.connectionSource = this.connectionSource

      return clone
    }

    then(...args) {
      return this.execute().then(...args)
    }

    catch(...args) {
      return this.execute().catch(...args)
    }
  }
}
