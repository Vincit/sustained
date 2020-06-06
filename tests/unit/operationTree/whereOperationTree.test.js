import { raw } from '../../../src'
import { expect, query } from '../../testUtils'

describe('operation tree', () => {
  describe('where', () => {
    it(`where('column', 'value')`, () => {
      const builder = query().where('column', 'value');

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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

    it(`where(qb => qb.where('a', 1).orWhere('b', 2))`, () => {
      const builder = query().where(qb => {
        // No return on purpose.
        qb.where('a', 1).orWhere('b', 2);
      });

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        where: [
          {
            type: 'FilterGroupNode',
            bool: 'and',
            not: false,
            items: [
              {
                type: 'WhereNode',
                lhs: {
                  type: 'IdentifierNode',
                  ids: ['a']
                },
                op: {
                  type: 'OperatorNode',
                  operator: '='
                },
                rhs: {
                  type: 'ValueNode',
                  value: 1
                },
                bool: 'and',
                not: false
              },
              {
                type: 'WhereNode',
                lhs: {
                  type: 'IdentifierNode',
                  ids: ['b']
                },
                op: {
                  type: 'OperatorNode',
                  operator: '='
                },
                rhs: {
                  type: 'ValueNode',
                  value: 2
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

    it(`where('table.column', '>', 'value')`, () => {
      const builder = query().where('table.column', '>', 'value');

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 10
              },
              max: {
                type: 'ValueNode',
                value: 20
              }
            }
          }
        ],
        alias: null
      });
    });

    it(`where("col", "between", [10, raw('?', 20)])`, () => {
      const builder = query().where('col', 'between', [10, raw('?', 20)]);

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 10
              },
              max: {
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
            }
          }
        ],
        alias: null
      });
    });

    it(`where(qb => qb.where('a', '>', 2).orWhere('a', '<', 4))`, () => {
      const builder = query().where(qb => qb.where('a', '>', 2).orWhere('a', '<', 4));

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        where: [
          {
            type: 'FilterGroupNode',
            bool: 'and',
            not: false,
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
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
              having: [],
              orderBy: [],
              select: [
                {
                  type: 'SelectNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['*']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  node: {
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

    it(`test all variations of where methods`, () => {
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
        .orWhereNotBetween('i', [3, 4])
        .whereExists(
          query()
            .select('*')
            .from('foo')
        )
        .andWhereExists(qb => qb.select('id').from('bar'))
        .orWhereExists(qb => qb.select('id').from('bar'))
        .orWhereNotExists(qb => qb.select('id').from('bar'))
        .andWhereNotExists(qb => qb.select('id').from('bar'));

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        where: [
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
              value: 1
            },
            bool: 'and',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['b']
            },
            op: {
              type: 'OperatorNode',
              operator: '>'
            },
            rhs: {
              type: 'ValueNode',
              value: 1
            },
            bool: 'and',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['b']
            },
            op: {
              type: 'OperatorNode',
              operator: 'is'
            },
            rhs: {
              type: 'ValueNode',
              value: null
            },
            bool: 'and',
            not: true
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['b']
            },
            op: {
              type: 'OperatorNode',
              operator: '>'
            },
            rhs: {
              type: 'ValueNode',
              value: 20
            },
            bool: 'and',
            not: true
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
              value: 2
            },
            bool: 'or',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['b']
            },
            op: {
              type: 'OperatorNode',
              operator: '='
            },
            rhs: {
              type: 'ValueNode',
              value: false
            },
            bool: 'or',
            not: true
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['c']
            },
            op: {
              type: 'OperatorNode',
              operator: 'in'
            },
            rhs: {
              type: 'ValueListNode',
              items: [
                {
                  type: 'ValueNode',
                  value: 1
                },
                {
                  type: 'ValueNode',
                  value: 2
                },
                {
                  type: 'ValueNode',
                  value: 3
                }
              ]
            },
            bool: 'and',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['c']
            },
            op: {
              type: 'OperatorNode',
              operator: 'in'
            },
            rhs: {
              type: 'ValueListNode',
              items: [
                {
                  type: 'ValueNode',
                  value: 4
                },
                {
                  type: 'ValueNode',
                  value: 5
                },
                {
                  type: 'ValueNode',
                  value: 6
                }
              ]
            },
            bool: 'and',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['d']
            },
            op: {
              type: 'OperatorNode',
              operator: 'in'
            },
            rhs: {
              type: 'ValueListNode',
              items: [
                {
                  type: 'ValueNode',
                  value: 1
                },
                {
                  type: 'ValueNode',
                  value: 2
                }
              ]
            },
            bool: 'or',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['e']
            },
            op: {
              type: 'OperatorNode',
              operator: 'in'
            },
            rhs: {
              type: 'ValueListNode',
              items: [
                {
                  type: 'ValueNode',
                  value: 1
                },
                {
                  type: 'ValueNode',
                  value: 2
                }
              ]
            },
            bool: 'and',
            not: true
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['e']
            },
            op: {
              type: 'OperatorNode',
              operator: 'in'
            },
            rhs: {
              type: 'QueryNode',
              select: [
                {
                  type: 'SelectNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['*']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['foo']
                  },
                  alias: null
                }
              ],
              where: [],
              alias: null
            },
            bool: 'or',
            not: true
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['d']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 100
              },
              max: {
                type: 'ValueNode',
                value: 200
              }
            },
            bool: 'and',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['f']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 'a'
              },
              max: {
                type: 'ValueNode',
                value: 'b'
              }
            },
            bool: 'and',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['g']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 'x'
              },
              max: {
                type: 'ValueNode',
                value: 'y'
              }
            },
            bool: 'or',
            not: false
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['h']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 1
              },
              max: {
                type: 'ValueNode',
                value: 2
              }
            },
            bool: 'and',
            not: true
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['h']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 2
              },
              max: {
                type: 'ValueNode',
                value: 3
              }
            },
            bool: 'and',
            not: true
          },
          {
            type: 'WhereNode',
            lhs: {
              type: 'IdentifierNode',
              ids: ['i']
            },
            op: {
              type: 'OperatorNode',
              operator: 'between'
            },
            rhs: {
              type: 'ValueRangeNode',
              min: {
                type: 'ValueNode',
                value: 3
              },
              max: {
                type: 'ValueNode',
                value: 4
              }
            },
            bool: 'or',
            not: true
          },
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
                  node: {
                    type: 'IdentifierNode',
                    ids: ['*']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  node: {
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
          },
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
                  node: {
                    type: 'IdentifierNode',
                    ids: ['id']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['bar']
                  },
                  alias: null
                }
              ],
              where: [],
              alias: null
            },
            bool: 'and',
            not: false
          },
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
                  node: {
                    type: 'IdentifierNode',
                    ids: ['id']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['bar']
                  },
                  alias: null
                }
              ],
              where: [],
              alias: null
            },
            bool: 'or',
            not: false
          },
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
                  node: {
                    type: 'IdentifierNode',
                    ids: ['id']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['bar']
                  },
                  alias: null
                }
              ],
              where: [],
              alias: null
            },
            bool: 'or',
            not: true
          },
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
                  node: {
                    type: 'IdentifierNode',
                    ids: ['id']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['bar']
                  },
                  alias: null
                }
              ],
              where: [],
              alias: null
            },
            bool: 'and',
            not: true
          }
        ],
        alias: null
      });
    });
  });
});
