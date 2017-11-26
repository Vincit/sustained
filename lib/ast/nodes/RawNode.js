const { AstNode } = require('./AstNode');

class RawNode extends AstNode {
  constructor(sql, bindings) {
    super();

    this.sql = sql;
    this.bindings = bindings;
  }
}

module.exports = {
  RawNode
};
