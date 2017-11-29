const { AstNode } = require('./AstNode');

class JoinNode extends AstNode {
  constructor(joinType, target, on) {
    super();

    this.joinType = joinType || null;
    this.target = target || null;
    this.on = on || [];
  }
}

module.exports = {
  JoinNode
};
