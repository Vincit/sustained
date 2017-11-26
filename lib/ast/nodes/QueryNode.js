const { AstNode } = require('./AstNode');
const { isAstNode } = require('../../utils/typeUtils');

const QueryType = {
  Select: 'select',
  Insert: 'insert',
  Update: 'update',
  Delete: 'delete'
};

class QueryNode extends AstNode {
  constructor() {
    super();
    this.queryType = QueryType.Select;

    this.select = [];
    this.from = [];
    this.where = [];
    this.having = [];
    this.orderBy = [];
    this.groupBy = [];
    this.join = [];

    this.limit = null;
    this.offset = null;
    this.alias = null;
  }
}

module.exports = {
  QueryNode,
  QueryType
};
