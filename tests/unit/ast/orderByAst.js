const { QueryBuilder, raw } = require('../../../');
const { expect, query, logAst } = require('../../testUtils');

describe('AST', () => {
  describe('orderBy', () => {
    it(`orderBy('column')`, () => {
      const builder = query().orderBy('column');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
              type: 'IdentifierNode',
              ids: ['column']
            },
            dir: 'asc'
          }
        ],
        alias: null
      });
    });

    it(`orderBy(raw('column'))`, () => {
      const builder = query().orderBy(raw('column'));

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        queryType: 'select',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
              type: 'RawNode',
              sql: 'column',
              bindings: []
            },
            dir: 'asc'
          }
        ]
      });
    });

    it(`orderBy('column', 'table.column2')`, () => {
      const builder = query().orderBy('column', 'table.column2');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
              type: 'IdentifierNode',
              ids: ['column']
            },
            dir: 'asc'
          },

          {
            type: 'OrderByNode',
            orderBy: {
              type: 'IdentifierNode',
              ids: ['table', 'column2']
            },
            dir: 'asc'
          }
        ],
        alias: null
      });
    });

    it(`orderBy('column', 'table.column2', 'desc')`, () => {
      const builder = query().orderBy('column', 'table.column2', 'desc');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
              type: 'IdentifierNode',
              ids: ['column']
            },
            dir: 'desc'
          },

          {
            type: 'OrderByNode',
            orderBy: {
              type: 'IdentifierNode',
              ids: ['table', 'column2']
            },
            dir: 'desc'
          }
        ],
        alias: null
      });
    });

    it(`orderBy(['column', 'table.column2'], 'desc')`, () => {
      const builder = query().orderBy(['column', 'table.column2'], 'desc');

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
              type: 'IdentifierNode',
              ids: ['column']
            },
            dir: 'desc'
          },

          {
            type: 'OrderByNode',
            orderBy: {
              type: 'IdentifierNode',
              ids: ['table', 'column2']
            },
            dir: 'desc'
          }
        ],
        alias: null
      });
    });

    it(`orderBy(query().select('id').from('foo'))`, () => {
      const builder = query().orderBy(
        query()
          .select('id')
          .from('foo')
      );

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
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
                    ids: ['foo']
                  },
                  alias: null
                }
              ],
              alias: null
            },
            dir: 'asc'
          }
        ],
        alias: null
      });
    });

    it(`orderBy(query().select('id').from('foo'), 'desc')`, () => {
      const builder = query().orderBy(
        query()
          .select('id')
          .from('foo'),
        'desc'
      );

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
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
                    ids: ['foo']
                  },
                  alias: null
                }
              ],
              alias: null
            },
            dir: 'desc'
          }
        ],
        alias: null
      });
    });

    it(`orderBy([query().select('id').from('foo'), query().select('id2').from('bar')], 'desc')`, () => {
      const builder = query().orderBy(
        [
          query()
            .select('id')
            .from('foo'),

          query()
            .select('id2')
            .from('bar')
        ],
        'desc'
      );

      expect(builder.ast).to.containSubset({
        type: 'QueryNode',
        orderBy: [
          {
            type: 'OrderByNode',
            orderBy: {
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
                    ids: ['foo']
                  },
                  alias: null
                }
              ],
              alias: null
            },
            dir: 'desc'
          },

          {
            type: 'OrderByNode',
            orderBy: {
              type: 'QueryNode',
              select: [
                {
                  type: 'SelectNode',
                  node: {
                    type: 'IdentifierNode',
                    ids: ['id2']
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
              alias: null
            },
            dir: 'desc'
          }
        ],
        alias: null
      });
    });
  });
});
