const { AstNode } = require('./AstNode');

class ObjectNode extends AstNode {
  constructor(propeties) {
    super();
    this.properties = propeties;
  }
}

module.exports = {
  ObjectNode
};
