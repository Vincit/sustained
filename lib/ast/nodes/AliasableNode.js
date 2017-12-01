const { AstNode } = require('./AstNode');

class AliasableNode extends AstNode {
  constructor(node, alias) {
    super();

    this.node = node;
    this.alias = alias || null;
  }
}

module.exports = {
  AliasableNode
};
