const { RawAstBuilder } = require('../ast/builders/RawAstBuilder');
const { Executable } = require('./Executable');

class RawBuilder extends Executable(RawAstBuilder) {
  static create(...args) {
    return new this(...args);
  }
}

function raw(sql, ...bindings) {
  return new RawBuilder({
    sql,
    bindings
  });
}

module.exports = {
  RawAstBuilder,
  raw
};
