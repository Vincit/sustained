const { QueryCompiler } = require('../../compilers/QueryCompiler');

class PostgresqlQueryCompiler extends QueryCompiler {}

module.exports = {
  PostgresqlQueryCompiler
};
