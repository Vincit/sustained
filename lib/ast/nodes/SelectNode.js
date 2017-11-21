const { AstNode } = require('./AstNode');

class SelectNode extends AstNode {
  constructor(selection, alias) {
    super();

    this.selection = selection;
    this.alias = alias || null;
  }

  transform(visitor) {
    this.selection = this.selection.transform(visitor);

    if (this.alias !== null) {
      this.alias = this.alias.transform(visitor);
    }

    return this.visit(visitor);
  }
}

module.exports = {
  SelectNode
};
