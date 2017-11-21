const { expect } = require('chai');
const { QueryBuilder, raw } = require('../../../');
const { query, logAst } = require('../../testUtils');

describe('AST', () => {
  describe('where', () => {
    it(`where('column', 'value')`, () => {
      const builder = query().where('column', 'value');

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            bool: 'and',
            not: false,
            lhs: {
              type: 'IdentifierNode',
              ids: ['column']
            },
            op: {
              type: 'OperatorNode',
              operator: '='
            },
            rhs: {
              type: 'ValueNode',
              value: 'value'
            }
          }
        ],
        alias: null
      });
    });

    it(`where('table.column', 'value')`, () => {
      const builder = query().where('table.column', 'value');

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            bool: 'and',
            not: false,
            lhs: {
              type: 'IdentifierNode',
              ids: ['table', 'column']
            },
            op: {
              type: 'OperatorNode',
              operator: '='
            },
            rhs: {
              type: 'ValueNode',
              value: 'value'
            }
          }
        ],
        alias: null
      });
    });

    it(`where('table.column', '>', 'value')`, () => {
      const builder = query().where('table.column', '>', 'value');

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            bool: 'and',
            not: false,
            lhs: {
              type: 'IdentifierNode',
              ids: ['table', 'column']
            },
            op: {
              type: 'OperatorNode',
              operator: '>'
            },
            rhs: {
              type: 'ValueNode',
              value: 'value'
            }
          }
        ],
        alias: null
      });
    });

    it(`where('schema.table.column', 'value')`, () => {
      const builder = query().where('schema.table.column', 'value');

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            bool: 'and',
            not: false,
            lhs: {
              type: 'IdentifierNode',
              ids: ['schema', 'table', 'column']
            },
            op: {
              type: 'OperatorNode',
              operator: '='
            },
            rhs: {
              type: 'ValueNode',
              value: 'value'
            }
          }
        ],
        alias: null
      });
    });

    it(`where({"schema.table.column": 'value'})`, () => {
      const builder = query().where({
        'schema.table.column': 'value'
      });

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            bool: 'and',
            not: false,
            lhs: {
              type: 'IdentifierNode',
              ids: ['schema', 'table', 'column']
            },
            op: {
              type: 'OperatorNode',
              operator: '='
            },
            rhs: {
              type: 'ValueNode',
              value: 'value'
            }
          }
        ],
        alias: null
      });
    });

    it(`where("col", "between", [10, 20])`, () => {
      const builder = query().where('col', 'between', [10, 20]);

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            bool: 'and',
            not: false,
            lhs: {
              type: 'IdentifierNode',
              ids: ['col']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ListNode',
              items: [
                {
                  type: 'ValueNode',
                  value: 10
                },
                {
                  type: 'ValueNode',
                  value: 20
                }
              ]
            }
          }
        ],
        alias: null
      });
    });

    it(`where("col", "between", [10, raw('?', 20)])`, () => {
      const builder = query().where('col', 'between', [10, raw('?', 20)]);

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            bool: 'and',
            not: false,
            lhs: {
              type: 'IdentifierNode',
              ids: ['col']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ListNode',
              items: [
                {
                  type: 'ValueNode',
                  value: 10
                },
                {
                  type: 'RawNode',
                  sql: '?',
                  bindings: [
                    {
                      type: 'BindingNode',
                      match: '?',
                      index: 0,
                      node: {
                        type: 'ValueNode',
                        value: 20
                      }
                    }
                  ]
                }
              ]
            }
          }
        ],
        alias: null
      });
    });

    it(`where(qb => qb.where('a', '>', 2).orWhere('a', '<', 4))`, () => {
      const builder = query().where(qb => qb.where('a', '>', 2).orWhere('a', '<', 4));

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'ListNode',
            items: [
              {
                type: 'WhereNode',
                lhs: {
                  type: 'IdentifierNode',
                  ids: ['a']
                },
                op: {
                  type: 'OperatorNode',
                  operator: '>'
                },
                rhs: {
                  type: 'ValueNode',
                  value: 2
                },
                bool: 'and',
                not: false
              },
              {
                type: 'WhereNode',
                lhs: {
                  type: 'IdentifierNode',
                  ids: ['a']
                },
                op: {
                  type: 'OperatorNode',
                  operator: '<'
                },
                rhs: {
                  type: 'ValueNode',
                  value: 4
                },
                bool: 'or',
                not: false
              }
            ]
          }
        ],
        alias: null
      });
    });

    it(`whereExists(qb => qb.from('foo').select('*'))`, () => {
      const builder = query().whereExists(qb => qb.from('foo').select('*'));

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        select: [],
        from: [],
        where: [
          {
            type: 'WhereNode',
            lhs: null,
            op: {
              type: 'OperatorNode',
              operator: 'exists'
            },
            rhs: {
              type: 'QueryNode',
              select: [
                {
                  type: 'SelectNode',
                  selection: {
                    type: 'IdentifierNode',
                    ids: ['*']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  from: {
                    type: 'IdentifierNode',
                    ids: ['foo']
                  },
                  alias: null
                }
              ],
              where: [],
              alias: null
            },
            bool: 'and',
            not: false
          }
        ],
        alias: null
      });
    });

    it.skip(`test all variations of where methods`, () => {
      const N = 100000;
      const t0 = Date.now();

      for (let i = 0; i < N; ++i) {
        const builder = query()
          .where('a', '>', 1)
          .andWhere('b', '>', 1)
          .whereNot('b', 'is', null)
          .andWhereNot('b', '>', 20)
          .orWhere('a', '<', 2)
          .orWhereNot('b', false)
          .whereIn('c', [1, 2, 3])
          .andWhereIn('c', [4, 5, 6])
          .orWhereIn('d', [1, 2])
          .whereNotIn('e', [1, 2])
          .orWhereNotIn(
            'e',
            query()
              .from('foo')
              .select('*')
          )
          .whereBetween('d', [100, 200])
          .andWhereBetween('f', ['a', 'b'])
          .orWhereBetween('g', ['x', 'y'])
          .whereNotBetween('h', [1, 2])
          .andWhereNotBetween('h', [2, 3])
          .orWhereNotBetween('i', [3, 4]);
      }

      const t1 = Date.now();
      console.log('time ' + ((t1 - t0) / N) + ' ms');

      //logAst(builder.ast);

      //expect(builder.ast).to.eql({});
    });
  });
});
