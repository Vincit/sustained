const { AstNode } = require('./AstNode');

class ValueNode extends AstNode {
  constructor(value) {
    super();
    this.value = value;
  }
}

module.exports = {
  ValueNode
};
