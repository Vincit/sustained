const { RawAstBuilder } = require('../ast/RawAstBuilder');
const { Executable } = require('./Executable');

class RawBuilder extends Executable(RawAstBuilder) {}

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
