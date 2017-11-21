const { AstNode } = require('./AstNode');

class RawNode extends AstNode {
  constructor(sql, bindings) {
    super();

    this.sql = sql;
    this.bindings = bindings;
  }

  transform(visitor) {
    this.bindings = this.bindings.map(it => it.transform(visitor));
    return this.visit(visitor);
  }
}

module.exports = {
  RawNode
};
