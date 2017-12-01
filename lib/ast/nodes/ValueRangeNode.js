const { AstNode } = require('./AstNode');

class ValueRangeNode extends AstNode {
  constructor(min, max) {
    super();
    this.min = min;
    this.max = max;
  }
}

module.exports = {
  ValueRangeNode
};
