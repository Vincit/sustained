const { AstNode } = require('./AstNode');

class InsertNode extends AstNode {
  constructor(rows) {
    super();
    this.rows = rows;
  }
}

module.exports = {
  InsertNode
};
