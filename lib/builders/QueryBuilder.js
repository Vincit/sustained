const { QueryAstBuilder } = require('../ast/QueryAstBuilder');
const { Executable } = require('./Executable');

class QueryBuilder extends Executable(QueryAstBuilder) {}

module.exports = {
  QueryBuilder
};
