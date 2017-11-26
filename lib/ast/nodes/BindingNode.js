const { AstNode } = require('./AstNode');

class BindingNode extends AstNode {
  constructor(match, index, node) {
    super();

    this.match = match;
    this.index = index;
    this.node = node;
  }
}

module.exports = {
  BindingNode
};
