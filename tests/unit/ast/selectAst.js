const { expect } = require('chai');
const { QueryBuilder, raw } = require('../../../');
const { query, logAst } = require('../../testUtils');

describe('AST', () => {
  describe('select', () => {
    it(`select('col1', 'columnTwo')`, () => {
      const builder = query().select('col1', 'columnTwo');

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        from: [],
        where: [],
        select: [
          {
            type: 'SelectNode',
            selection: {
              type: 'IdentifierNode',
              ids: ['col1']
            },
            alias: null
          },
          {
            type: 'SelectNode',
            selection: {
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

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        from: [],
        where: [],
        select: [
          {
            type: 'SelectNode',
            selection: {
              type: 'IdentifierNode',
              ids: ['col1']
            },
            alias: null
          },
          {
            type: 'SelectNode',
            selection: {
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

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        from: [],
        where: [],
        select: [
          {
            type: 'SelectNode',
            selection: {
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

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        from: [],
        where: [],
        select: [
          {
            type: 'SelectNode',
            selection: {
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

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        from: [],
        where: [],
        select: [
          {
            type: 'SelectNode',
            selection: {
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
            selection: {
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

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        from: [],
        where: [],
        select: [
          {
            type: 'SelectNode',
            selection: {
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
            selection: {
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

      expect(builder.ast).to.eql({
        type: 'QueryNode',
        from: [],
        where: [],
        select: [
          {
            type: 'SelectNode',
            selection: {
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
            selection: {
              type: 'QueryNode',
              where: [],
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
              select: [
                {
                  type: 'SelectNode',
                  selection: {
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
