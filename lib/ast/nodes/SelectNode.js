const { AstNode } = require('./AstNode');

class SelectNode extends AstNode {
  constructor(selection, alias) {
    super();

    this.selection = selection;
    this.alias = alias || null;
  }
}

module.exports = {
  SelectNode
};
