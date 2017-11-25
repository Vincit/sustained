const { AstNode } = require('./AstNode');
const { isAstNode } = require('../../utils/typeUtils');

class QueryNode extends AstNode {
  constructor() {
    super();

    this.select = [];
    this.from = [];
    this.where = [];
    this.having = [];
    this.alias = null;
  }

  forEachChild(cb) {
    this.select.forEach(cb);
    this.from.forEach(cb);
    this.where.forEach(cb);
    this.having.forEach(cb);

    if (this.alias) {
      cb(this.alias);
    }
  }

  transform(visitor) {
    this.select = this.select.map(it => it.transform(visitor));
    this.from = this.from.map(it => it.transform(visitor));
    this.where = this.where.map(it => it.transform(visitor));
    this.having = this.having.map(it => it.transform(visitor));

    if (this.alias !== null) {
      this.alias = this.alias.transform(visitor);
    }

    return this.visit(visitor);
  }
}

module.exports = {
  QueryNode
};
