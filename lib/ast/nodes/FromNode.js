const { AstNode } = require('./AstNode');

class FromNode extends AstNode {
  constructor(from, alias) {
    super();

    this.from = from;
    this.alias = alias || null;
  }

  transform(visitor) {
    this.from = this.from.transform(visitor);

    if (this.alias !== null) {
      this.alias = this.alias.transform(visitor);
    }

    return this.visit(visitor);
  }
}

module.exports = {
  FromNode
};
