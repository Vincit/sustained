const { AstNode } = require('./AstNode');

class IdentifierNode extends AstNode {
  constructor(ids) {
    super();
    this.ids = ids;
  }
}

module.exports = {
  IdentifierNode
};
