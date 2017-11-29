const { QueryBuilder, raw } = require('../../../');
const { expect, query, logAst } = require('../../testUtils');

describe('AST', () => {
  describe('groupBy', () => {
    it(`groupBy('column')`, () => {
      const builder = query().groupBy('column');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        groupBy: [
          {
            type: 'GroupByNode',
            groupBy: {
              type: 'IdentifierNode',
              ids: ['column']
            }
          }
        ],
        alias: null
      });
    });

    it(`groupBy(raw('column'))`, () => {
      const builder = query().groupBy(raw('column'));

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        queryType: 'select',
        groupBy: [
          {
            type: 'GroupByNode',
            groupBy: {
              type: 'RawNode',
              sql: 'column',
              bindings: []
            }
          }
        ]
      });
    });

    it(`groupBy('column', 'table.column2')`, () => {
      const builder = query().groupBy('column', 'table.column2');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        groupBy: [
          {
            type: 'GroupByNode',
            groupBy: {
              type: 'IdentifierNode',
              ids: ['column']
            }
          },

          {
            type: 'GroupByNode',
            groupBy: {
              type: 'IdentifierNode',
              ids: ['table', 'column2']
            }
          }
        ],
        alias: null
      });
    });

    it(`groupBy(['column', 'table.column2'])`, () => {
      const builder = query().groupBy(['column', 'table.column2']);

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        groupBy: [
          {
            type: 'GroupByNode',
            groupBy: {
              type: 'IdentifierNode',
              ids: ['column']
            }
          },

          {
            type: 'GroupByNode',
            groupBy: {
              type: 'IdentifierNode',
              ids: ['table', 'column2']
            }
          }
        ],
        alias: null
      });
    });

    it(`groupBy(query().select('id').from('foo'))`, () => {
      const builder = query().groupBy(
        query()
          .select('id')
          .from('foo')
      );

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        groupBy: [
          {
            type: 'GroupByNode',
            groupBy: {
              type: 'QueryNode',
              select: [
                {
                  type: 'SelectNode',
                  identifier: {
                    type: 'IdentifierNode',
                    ids: ['id']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  identifier: {
                    type: 'IdentifierNode',
                    ids: ['foo']
                  },
                  alias: null
                }
              ],
              alias: null
            }
          }
        ],
        alias: null
      });
    });

    it(`groupBy([query().select('id').from('foo'), query().select('id2').from('bar')])`, () => {
      const builder = query().groupBy([
        query()
          .select('id')
          .from('foo'),

        query()
          .select('id2')
          .from('bar')
      ]);

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        groupBy: [
          {
            type: 'GroupByNode',
            groupBy: {
              type: 'QueryNode',
              select: [
                {
                  type: 'SelectNode',
                  identifier: {
                    type: 'IdentifierNode',
                    ids: ['id']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  identifier: {
                    type: 'IdentifierNode',
                    ids: ['foo']
                  },
                  alias: null
                }
              ],
              alias: null
            }
          },

          {
            type: 'GroupByNode',
            groupBy: {
              type: 'QueryNode',
              select: [
                {
                  type: 'SelectNode',
                  identifier: {
                    type: 'IdentifierNode',
                    ids: ['id2']
                  },
                  alias: null
                }
              ],
              from: [
                {
                  type: 'FromNode',
                  identifier: {
                    type: 'IdentifierNode',
                    ids: ['bar']
                  },
                  alias: null
                }
              ],
              alias: null
            }
          }
        ],
        alias: null
      });
    });
  });
});
