const { AstNode } = require('./AstNode');

class AliasableNode extends AstNode {
  constructor(identifier, alias) {
    super();

    this.identifier = identifier;
    this.alias = alias || null;
  }
}

module.exports = {
  AliasableNode
};
