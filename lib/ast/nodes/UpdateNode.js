const { AstNode } = require('./AstNode');

class UpdateNode extends AstNode {
  constructor(values) {
    super();
    this.values = values;
  }
}

module.exports = {
  UpdateNode
};
