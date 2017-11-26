const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

const { QueryBuilder } = require('../');

function query() {
  return QueryBuilder.create();
}

function logAst(ast) {
  console.log(JSON.stringify(ast, null, 2));
}

module.exports = {
  query,
  logAst,
  expect: chai.expect
};
