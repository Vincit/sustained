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

      return connectionFactory().then(connection => {
        return connection.execute(this.toSQL({ compiler }));
      });
    }

    then(...args) {
      return this.execute().then(...args);
    }
  };
};

module.exports = {
  Executable
};
