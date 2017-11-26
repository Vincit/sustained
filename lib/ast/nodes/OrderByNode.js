const { AstNode } = require('./AstNode');

const OrderByDir = {
  Asc: 'asc',
  Desc: 'desc'
};

class OrderByNode extends AstNode {
  constructor(orderBy) {
    super();
    this.orderBy = orderBy;
  }
}

module.exports = {
  OrderByNode,
  OrderByDir
};
