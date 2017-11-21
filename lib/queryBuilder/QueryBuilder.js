const { QueryAstBuilder } = require('../ast/QueryAstBuilder');

class QueryBuilder extends QueryAstBuilder {}

Object.defineProperties(QueryBuilder.prototype, {
  isSustainedQueryBuilder: {
    enumerable: false,
    value: true
  }
});

module.exports = {
  QueryBuilder
};
