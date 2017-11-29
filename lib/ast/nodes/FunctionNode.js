const { AstNode } = require('./AstNode');

class FunctionNode extends AstNode {
  constructor(name, modifiers, args) {
    super();

    this.name = name;
    this.modifiers = modifiers;
    this.args = args;
  }
}

module.exports = {
  FunctionNode
};
