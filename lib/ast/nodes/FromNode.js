const { AstNode } = require('./AstNode');

class FromNode extends AstNode {
  constructor(from, alias) {
    super();

    this.from = from;
    this.alias = alias || null;
  }
}

module.exports = {
  FromNode
};
