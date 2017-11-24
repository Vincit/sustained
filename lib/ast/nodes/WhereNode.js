const { AstNode } = require('./AstNode');

const Bool = {
  And: 'and',
  Or: 'or'
};

class WhereNode extends AstNode {
  constructor(lhs, op, rhs, bool, not) {
    super();

    this.lhs = lhs;
    this.op = op;
    this.rhs = rhs;

    this.bool = bool;
    this.not = not;
  }

  transform(visitor) {
    this.lhs = this.lhs.transform(visitor);
    this.op = this.op.transform(visitor);
    this.rhs = this.rhs.transform(visitor);

    return this.visit(visitor);
  }
}

module.exports = {
  WhereNode,
  Bool
};
