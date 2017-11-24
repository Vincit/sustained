const { expect } = require('chai');
const { QueryBuilder, raw } = require('../../');
const { query, logAst } = require('../testUtils');

describe.skip('compiler playground', () => {
  it('test', () => {
    const builder = query()
      .select('a', 'b')
      .from([
        query()
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
      });

    const compiler = {
      bindings: [],

      QueryNode(node, { parent }) {
        const isSubQuery = !!parent;
        let sql = '';

        if (isSubQuery || node.alias) {
          sql += '(';
        }

        sql += 'SELECT ';

        sql += node.select.map((it, idx) => it.visit(this, { parent: node, idx })).join(', ');

        sql += ' FROM ';

        sql += node.from.map((it, idx) => it.visit(this, { parent: node, idx })).join(', ');

        if (node.where.length) {
          sql += ' WHERE ';

          node.where.forEach((it, idx) => (sql += it.visit(this, { parent: node, idx })));
        }

        if (isSubQuery || node.alias) {
          sql += ')';
        }

        if (node.alias) {
          sql += ' as ' + node.alias.visit(this, { parent: node });
        }

        return sql;
      },

      WhereNode(node, { parent, idx }) {
        let sql = '';

        if (idx !== 0) {
          sql += node.bool + ' ';
        }

        if (idx !== 0 && node.not) {
          sql += 'not ';
        }

        if (node.lhs) {
          sql += node.lhs.visit(this, { parent: node }) + ' ';
        }

        if (node.op) {
          sql += node.op.visit(this, { parent: node }) + ' ';
        }

        if (node.rhs) {
          sql += node.rhs.visit(this, { parent: node }) + ' ';
        }

        return sql;
      },

      SelectNode(node, { parent }) {
        let sql = '';

        sql += node.selection.visit(this, { parent: node });

        if (node.alias) {
          sql += ' as ' + node.alias.visit(this, { parent: node });
        }

        return sql;
      },

      FromNode(node, { parent }) {
        let sql = '';

        sql += node.from.visit(this, { parent: node });

        if (node.alias) {
          sql += ' as ' + node.alias.visit(this, { parent: node });
        }

        return sql;
      },

      ValueNode(node) {
        return this.nextBinding(node.value);
      },

      OperatorNode(node) {
        return node.operator;
      },

      IdentifierNode(node) {
        return node.ids.map(compiler.wrapIdentifier).join('.');
      },

      RawNode(node) {
        const origSql = node.sql;

        let sql = '';
        let prevEnd = 0;

        node.bindings.forEach(binding => {
          const { match, index, node: bindNode } = binding;

          sql += origSql.slice(prevEnd, index);
          sql += bindNode.visit(this, { parent: node });

          prevEnd = index + match.length;
        });

        sql += origSql.slice(prevEnd, origSql.length);

        return sql;
      },

      wrapIdentifier(id) {
        if (id === '*') {
          return id;
        } else {
          return '"' + id + '"';
        }
      },

      nextBinding(value) {
        this.bindings.push(value);
        return '$' + this.bindings.length;
      }
    };

    const sql = builder.ast.visit(compiler, {});

    console.log(sql, compiler.bindings);
  });
});
