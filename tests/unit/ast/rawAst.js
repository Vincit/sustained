const { expect } = require('chai');
const { QueryBuilder, raw } = require('../../../');
const { query, logAst } = require('../../testUtils');

describe('AST', () => {
  describe('raw', () => {
    it(`raw("select * from ??", "users")`, () => {
      const node = raw('select * from ??', 'users').ast;

      expect(node).to.eql({
        type: 'RawNode',
        sql: 'select * from ??',
        bindings: [
          {
            type: 'BindingNode',
            match: '??',
            index: 14,
            node: {
              type: 'IdentifierNode',
              ids: ['users']
            }
          }
        ]
      });
    });

    it(`raw("select * from :table:", {table: "users"})`, () => {
      const node = raw('select * from :table:', { table: 'users' }).ast;

      expect(node).to.eql({
        type: 'RawNode',
        sql: 'select * from :table:',
        bindings: [
          {
            type: 'BindingNode',
            match: ':table:',
            index: 14,
            node: {
              type: 'IdentifierNode',
              ids: ['users']
            }
          }
        ]
      });
    });

    it(`raw("select * from ?? where foo = ?", "users", "bar")`, () => {
      const node = raw('select * from ?? where foo = ?', 'users', 'bar').ast;

      expect(node).to.eql({
        type: 'RawNode',
        sql: 'select * from ?? where foo = ?',
        bindings: [
          {
            type: 'BindingNode',
            match: '??',
            index: 14,
            node: {
              type: 'IdentifierNode',
              ids: ['users']
            }
          },
          {
            type: 'BindingNode',
            match: '?',
            index: 29,
            node: {
              type: 'ValueNode',
              value: 'bar'
            }
          }
        ]
      });
    });

    it(`raw("select * from ?? where foo = ?", ["users", "bar"])`, () => {
      const node = raw('select * from ?? where foo = ?', ['users', 'bar']).ast;

      expect(node).to.eql({
        type: 'RawNode',
        sql: 'select * from ?? where foo = ?',
        bindings: [
          {
            type: 'BindingNode',
            match: '??',
            index: 14,
            node: {
              type: 'IdentifierNode',
              ids: ['users']
            }
          },
          {
            type: 'BindingNode',
            match: '?',
            index: 29,
            node: {
              type: 'ValueNode',
              value: 'bar'
            }
          }
        ]
      });
    });

    it(`raw("select * from ?? where foo \\?| ?", ["users", "bar"])`, () => {
      const node = raw('select * from ?? where foo \\?| ?', ['users', 'bar']).ast;

      expect(node).to.eql({
        type: 'RawNode',
        sql: 'select * from ?? where foo \\?| ?',
        bindings: [
          {
            type: 'BindingNode',
            match: '??',
            index: 14,
            node: {
              type: 'IdentifierNode',
              ids: ['users']
            }
          },
          {
            type: 'BindingNode',
            match: '?',
            index: 31,
            node: {
              type: 'ValueNode',
              value: 'bar'
            }
          }
        ]
      });
    });

    it(`raw("select * from :table: where foo = :foo", {table: "users", foo: "bar"})`, () => {
      const node = raw('select * from :table: where foo = :foo', {
        table: 'users',
        foo: 'bar'
      }).ast;

      expect(node).to.eql({
        type: 'RawNode',
        sql: 'select * from :table: where foo = :foo',
        bindings: [
          {
            type: 'BindingNode',
            match: ':table:',
            index: 14,
            node: {
              type: 'IdentifierNode',
              ids: ['users']
            }
          },
          {
            type: 'BindingNode',
            match: ':foo',
            index: 34,
            node: {
              type: 'ValueNode',
              value: 'bar'
            }
          }
        ]
      });
    });

    it(`raw("select * from :theTable: where foo = :fooBar", {theTable: "users", fooBar: "bar"})`, () => {
      const node = raw('select * from :theTable: where foo = :fooBar', {
        theTable: 'users',
        fooBar: 'bar'
      }).ast;

      expect(node).to.eql({
        type: 'RawNode',
        sql: 'select * from :theTable: where foo = :fooBar',
        bindings: [
          {
            type: 'BindingNode',
            match: ':theTable:',
            index: 14,
            node: {
              type: 'IdentifierNode',
              ids: ['users']
            }
          },
          {
            type: 'BindingNode',
            match: ':fooBar',
            index: 37,
            node: {
              type: 'ValueNode',
              value: 'bar'
            }
          }
        ]
      });
    });
  });
});
