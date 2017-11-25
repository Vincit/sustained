const { RawAstBuilder } = require('../ast/RawAstBuilder');

class RawBuilder extends RawAstBuilder {
  constructor({ sql, bindings, connection, compiler }) {
    super({ sql, bindings });

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

function raw(sql, ...bindings) {
  return new RawBuilder({
    sql,
    bindings
  });
}

module.exports = {
  RawAstBuilder,
  raw
};