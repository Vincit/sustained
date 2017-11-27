const { AstNode } = require('./AstNode');

class JoinNode extends AstNode {
  constructor(joinType, target, on) {
    super();

    this.joinType = joinType;
    this.target = target;
    this.on = on;
  }
}

module.exports = {
  JoinNode
};
