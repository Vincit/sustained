const { asyncTry } = require('../utils/promiseUtils');

// Makes a given AstBuilder subclass executable by adding
// methods to compile SQL and execute the query.
const Executable = AnyAstBuilder => {
  return class extends AnyAstBuilder {
    constructor(args = {}) {
      super(args);

      this.compiler = args.compiler || null;
      this.connectionFactory = args.connectionFactory || null;
    }

    toSQL({ compiler } = {}) {
      compiler = compiler || this.compiler;
      return compiler.compile(this.ast);
    }

    execute({ compiler, connectionFactory }) {
      connectionFactory = connectionFactory || this.connectionFactory;
      const sql = this.toSQL({ compiler });

      return connectionFactory.acquire().then(connection => {
        return asyncTry(() => connection.execute(sql))
          .then(result => {
            return connectionFactory.release(connection).then(() => result);
          })
          .catch(err => {
            return connectionFactory.release(connection).then(() => Promise.reject(err));
          });
      });
    }

    then(...args) {
      return this.execute().then(...args);
    }

    catch(...args) {
      return this.execute().catch(...args);
    }
  };
};

module.exports = {
  Executable
};
