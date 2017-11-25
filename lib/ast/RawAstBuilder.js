const { RawNode } = require('./nodes');
const { AstBuilder } = require('./AstBuilder');
const { parseRaw } = require('./parsers/parseRaw');

class RawAstBuilder extends AstBuilder {
  constructor({ sql, bindings }) {
    super(parseRaw(sql, bindings));
  }

  wrap(left, right) {
    this.ast.sql = left + this.ast.sql + right;
    return this;
  }
}

function raw(sql, ...bindings) {
  return new RawAstBuilder({
    sql,
    bindings
  });
}

module.exports = {
  RawAstBuilder,
  raw
};
