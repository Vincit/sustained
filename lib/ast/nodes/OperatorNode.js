const { AstNode } = require('./AstNode');

class OperatorNode extends AstNode {
  constructor(operator) {
    super();
    this.operator = operator;
  }
}

module.exports = {
  OperatorNode
};
