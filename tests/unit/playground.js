const { expect } = require('chai');
const { QueryBuilder, QueryCompiler, raw } = require('../../');
const { logAst } = require('../testUtils');

describe('playground', () => {
  it('test', () => {
    const builder = QueryBuilder.create();
    const compiler = QueryCompiler.create();

    builder
      .select('a', 'b')
      .from([
        QueryBuilder.create()
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
      })
      .groupBy('a', 'b.c')
      .having('a', '<', 100);

    const { sql, bindings } = builder.toSQL({ compiler });

    console.log(sql, bindings);
  });

  it('test 2', () => {
    const query = () => {
      const compiler = QueryCompiler.create();
      return QueryBuilder.create({ compiler });
    };

    const knex = new Proxy(
      (...args) => {
        return query().from(...args);
      },
      {
        get(target, prop) {
          return (...args) => {
            return query()[prop](...args);
          };
        }
      }
    );

    console.log(
      knex('foo')
        .select('*')
        .toSQL()
    );
    console.log(
      knex
        .select('*')
        .from('tits')
        .toSQL()
    );
  });
});
