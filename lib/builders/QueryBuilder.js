const { QueryAstBuilder } = require('../ast/QueryAstBuilder');
const { QueryCompiler } = require('../compilers/QueryCompiler');

class QueryBuilder extends QueryAstBuilder {
  constructor({ compiler, connection } = {}) {
    super();

    this.compiler = compiler || null;
    this.connection = connection || null;
  }

  toSQL() {
    return this.compiler.compile(this.ast);
  }

  execute() {
    return this.connection.execute(this.toSQL());
  }
}

Object.defineProperties(QueryBuilder.prototype, {
  isSustainedQueryBuilder: {
    enumerable: false,
    value: true
  }
});

module.exports = {
  QueryBuilder
};
