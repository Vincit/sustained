const { QueryBuilder, raw } = require('../../../');
const { expect, query, logAst } = require('../../testUtils');

describe('AST', () => {
  describe('from', () => {
    it(`from('table1', 'tableTwo')`, () => {
      const builder = query().from('table1', 'tableTwo');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        queryType: 'select',
        groupBy: [],
        join: [],
        select: [],
        where: [],
        having: [],
        orderBy: [],
        from: [
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['table1']
            },
            alias: null
          },
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['tableTwo']
            },
            alias: null
          }
        ],
        alias: null,
        limit: null,
        offset: null
      });
    });

    it(`from(['table1', 'tableTwo'])`, () => {
      const builder = query().from(['table1', 'tableTwo']);

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['table1']
            },
            alias: null
          },
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['tableTwo']
            },
            alias: null
          }
        ]
      });
    });

    it(`from(raw('?? as fb'), 'fooBar'))`, () => {
      const builder = query().from(raw('?? as fb', 'fooBar'));

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            from: {
              type: 'RawNode',
              sql: '?? as fb',
              bindings: [
                {
                  type: 'BindingNode',
                  match: '??',
                  index: 0,
                  node: {
                    type: 'IdentifierNode',
                    ids: ['fooBar']
                  }
                }
              ]
            },
            alias: null
          }
        ]
      });
    });

    it(`from([raw('?? as fb'), 'fooBar')])`, () => {
      const builder = query().from([raw('?? as fb', 'fooBar')]);

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            from: {
              type: 'RawNode',
              sql: '?? as fb',
              bindings: [
                {
                  type: 'BindingNode',
                  match: '??',
                  index: 0,
                  node: {
                    type: 'IdentifierNode',
                    ids: ['fooBar']
                  }
                }
              ]
            },
            alias: null
          }
        ],
        alias: null
      });
    });

    it(`from('table1 as t', 'tableTwo as t2')`, () => {
      const builder = query().from('table1 as t', 'tableTwo as t2');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['table1']
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['t']
            }
          },
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['tableTwo']
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['t2']
            }
          }
        ],
        alias: null
      });
    });

    it(`from({alias1: 'table1', alias2: 'table2'})`, () => {
      const builder = query().table({ alias1: 'table1', alias2: 'table2' });

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['table1']
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['alias1']
            }
          },
          {
            type: 'FromNode',
            from: {
              type: 'IdentifierNode',
              ids: ['table2']
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['alias2']
            }
          }
        ],
        alias: null
      });
    });

    it(`from({alias1: raw('??', ['table1']), alias2: query().from('sub1').select('*')})`, () => {
      const builder = query().from({
        alias1: raw('??', ['table1']),
        alias2: query()
          .from('sub1')
          .select('*')
      });

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            from: {
              type: 'RawNode',
              sql: '??',
              bindings: [
                {
                  type: 'BindingNode',
                  match: '??',
                  index: 0,
                  node: {
                    type: 'IdentifierNode',
                    ids: ['table1']
                  }
                }
              ]
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['alias1']
            }
          },
          {
            type: 'FromNode',
            from: {
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
                    ids: ['sub1']
                  },
                  alias: null
                }
              ],
              alias: null
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['alias2']
            }
          }
        ],
        alias: null
      });
    });
  });
});
