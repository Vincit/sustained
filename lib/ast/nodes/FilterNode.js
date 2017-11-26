const { AstNode } = require('./AstNode');

const Bool = {
  And: 'and',
  Or: 'or'
};

class FilterNode extends AstNode {
  constructor(lhs, op, rhs, bool, not) {
    super();

    this.lhs = lhs;
    this.op = op;
    this.rhs = rhs;

    this.bool = bool;
    this.not = not;
  }
}

module.exports = {
  FilterNode,
  Bool
};
