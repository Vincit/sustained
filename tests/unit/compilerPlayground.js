const { expect } = require('chai');
const { QueryBuilder, QueryCompiler, raw } = require('../../');
const { query, logAst } = require('../testUtils');

describe('compiler playground', () => {
  it('test', () => {
    const builder = query()
      .select('a', 'b')
      .from([
        query()
          .select('*')
          .from('sub1')
          .as('tits'),
        'c as balls'
      ])
      .where('a', raw('(select ?? from ??)', 'id', 'lol'))
      .orWhere('c', '<', qb => {
        qb
          .select('c')
          .from('sub2')
          .where('id', 1);
      });

    const { sql, bindings } = QueryCompiler.compile(builder.ast);

    console.log(sql, bindings);
  });
});
