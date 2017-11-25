const { QueryAstBuilder } = require('../ast/QueryAstBuilder');
const { Executable } = require('./Executable');

class QueryBuilder extends Executable(QueryAstBuilder) {
  static create(...args) {
    return new this(...args);
  }
}

module.exports = {
  QueryBuilder
};
