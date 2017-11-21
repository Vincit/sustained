const { QueryBuilder } = require('../');

function query() {
  return QueryBuilder.create();
}

function logAst(ast) {
  console.log(JSON.stringify(ast, null, 2));
}

module.exports = {
  query,
  logAst
};
