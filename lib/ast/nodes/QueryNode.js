const { AstNode } = require('./AstNode');
const { isAstNode } = require('../../utils/typeUtils');

class QueryNode extends AstNode {
  constructor() {
    super();

    this.select = [];
    this.from = [];
    this.where = [];
    this.alias = null;
  }

  transform(visitor) {
    this.select = this.select.map(it => it.transform(visitor));
    this.from = this.from.map(it => it.transform(visitor));
    this.where = this.where.map(it => it.transform(visitor));

    if (this.alias !== null) {
      this.alias = this.alias.transform(visitor);
    }

    return this.visit(visitor);
  }
}

module.exports = {
  QueryNode
};
