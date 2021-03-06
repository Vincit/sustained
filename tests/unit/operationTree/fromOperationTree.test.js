import { raw } from '../../../src'
import { expect, query } from '../../testUtils'

describe('operation tree', () => {
  describe('from', () => {
    it(`from('table1', 'tableTwo')`, () => {
      const builder = query().from('table1', 'tableTwo');

      expect(builder.operationNode).to.containSubset({
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
            node: {
              type: 'IdentifierNode',
              ids: ['table1']
            },
            alias: null
          },
          {
            type: 'FromNode',
            node: {
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            node: {
              type: 'IdentifierNode',
              ids: ['table1']
            },
            alias: null
          },
          {
            type: 'FromNode',
            node: {
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            node: {
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            node: {
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            node: {
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
            node: {
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            node: {
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
            node: {
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

      expect(builder.operationNode).to.containSubset({
        type: 'QueryNode',
        from: [
          {
            type: 'FromNode',
            node: {
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
            node: {
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
