const { AstNode } = require('./AstNode');

class BindingNode extends AstNode {
  constructor(match, index, node) {
    super();

    this.match = match;
    this.index = index;
    this.node = node;
  }

  transform(visitor) {
    this.node = this.node.transform(visitor);
    return this.visit(visitor);
  }
}

module.exports = {
  BindingNode
};
