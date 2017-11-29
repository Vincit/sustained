const { QueryBuilder, QueryCompiler, raw } = require('../../');
const { expect, logAst } = require('../testUtils');

describe('playground', () => {
  it('test', () => {
    const builder = QueryBuilder.create();
    const compiler = QueryCompiler.create();

    /*
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
    */

    /*
    builder
      .select('*')
      .from('A')
      .leftOuterJoin('C', 'C.id', '>', 'A.id')
      .join('B', qb => {
        qb.on('A.id', 'B.a_id').on('A.id2', 'B.a_id2');
      });
    */

    //builder.insert([{ a: 1, b: 2 }, { a: 3, c: 4 }]).into('x');

    /*
    builder.delete().from('foo').where('id', '<', 10);
    */

    /*
    builder.update({a: 1, b: 'x'}).table('foo');
    */

    builder
      .select('*')
      .from('t1')
      .where('id', 1)
      .join('t2', 't2.id', 't1.id')
      .withSchema('s');

    // builder.ast = builder.ast.clone();

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

    /*
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
    */
  });
});
