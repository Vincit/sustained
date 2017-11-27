const { QueryAstBuilder } = require('../ast/builders/QueryAstBuilder');
const { Executable } = require('./Executable');

class QueryBuilder extends Executable(QueryAstBuilder) {
  static create(...args) {
    return new this(...args);
  }
}

module.exports = {
  QueryBuilder
};
