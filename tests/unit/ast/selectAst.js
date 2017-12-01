const { QueryBuilder, raw } = require('../../../');
const { expect, query, logAst } = require('../../testUtils');

describe('AST', () => {
  describe('select', () => {
    it(`select('col1', 'columnTwo')`, () => {
      const builder = query().select('col1', 'columnTwo');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        select: [
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['col1']
            },
            alias: null
          },
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['columnTwo']
            },
            alias: null
          }
        ],
        alias: null
      });
    });

    it(`select(['col1', 'columnTwo'])`, () => {
      const builder = query().select(['col1', 'columnTwo']);

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        select: [
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['col1']
            },
            alias: null
          },
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['columnTwo']
            },
            alias: null
          }
        ],
        alias: null
      });
    });

    it(`select(raw('max(??)', 'fooBar'))`, () => {
      const builder = query().select(raw('max(??)', 'fooBar'));

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        select: [
          {
            type: 'SelectNode',
            node: {
              type: 'RawNode',
              sql: 'max(??)',
              bindings: [
                {
                  type: 'BindingNode',
                  match: '??',
                  index: 4,
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

    it(`select([raw('max(??)', 'fooBar')])`, () => {
      const builder = query().select([raw('max(??)', 'fooBar')]);

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        select: [
          {
            type: 'SelectNode',
            node: {
              type: 'RawNode',
              sql: 'max(??)',
              bindings: [
                {
                  type: 'BindingNode',
                  match: '??',
                  index: 4,
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

    it(`select('col1 as c', 'columnTwo as col2')`, () => {
      const builder = query().select('col1 as c', 'columnTwo as col2');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        select: [
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['col1']
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['c']
            }
          },
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['columnTwo']
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['col2']
            }
          }
        ],
        alias: null
      });
    });

    it(`select({alias1: 'col1', alias2: 'col2'})`, () => {
      const builder = query().select({ alias1: 'col1', alias2: 'col2' });

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        select: [
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['col1']
            },
            alias: {
              type: 'IdentifierNode',
              ids: ['alias1']
            }
          },
          {
            type: 'SelectNode',
            node: {
              type: 'IdentifierNode',
              ids: ['col2']
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

    it(`select({alias1: raw('??', ['col']), alias2: query().from('sub1').select('subCol')})`, () => {
      const builder = query().select({
        alias1: raw('??', ['col']),
        alias2: query()
          .from('sub1')
          .select('subCol')
      });

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        select: [
          {
            type: 'SelectNode',
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
                    ids: ['col']
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
            type: 'SelectNode',
            node: {
              type: 'QueryNode',
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
              select: [
                {
                  type: 'SelectNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['subCol']
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
