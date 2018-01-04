const { RawNode } = require('../nodes');
const { AstBuilder } = require('./AstBuilder');
const { parseRaw } = require('../parsers/parseRaw');

class RawAstBuilder extends AstBuilder {
  constructor({ sql, bindings, ast } = {}) {
    super(ast || parseRaw(sql, bindings));
  }

  wrap(left, right) {
    this.ast.sql = left + this.ast.sql + right;

    // We need to move each binding's position by left.length.
    this.ast.bindings.forEach(it => {
      it.index += left.length;
    });

    return this;
  }

  clone() {
    return new this.constructor({
      ast: this.ast.clone()
    });
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
