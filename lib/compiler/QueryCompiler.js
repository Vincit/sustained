const { QueryCompilationResult } = require('./QueryCompilationResult');

class QueryCompiler {
  constructor(opt) {
    this.opt = Object.assign(
      {
        idLeftWrap: '"',
        idRightWrap: '"',
        wrapIdentifier: null
      },
      opt
    );

    this.bindings = null;
    this.parents = null;
  }

  static get QueryCompilationResult() {
    return QueryCompilationResult;
  }

  static create(...args) {
    return new this(...args);
  }

  compile(ast) {
    this.bindings = [];
    this.parents = this.createParentMap(ast);

    const sql = ast.visit(this);
    return new this.constructor.QueryCompilationResult(sql, this.bindings);
  }

  QueryNode(node) {
    const isSubQuery = this.parents.has(node);
    let sql = '';

    if (isSubQuery || node.alias) {
      sql += '(';
    }

    sql += node.queryType;

    if (node.queryType === 'select') {
      sql += ' ';

      sql += node.select.map((it, idx) => it.visit(this, { idx })).join(', ');
    }

    if (node.queryType === 'select' || node.queryType === 'delete') {
      sql += ' from ';
    } else if (node.queryType === 'insert') {
      sql += ' into ';
    } else if (node.queryType === 'update') {
      sql += ' ';
    }

    sql += node.from.map((it, idx) => it.visit(this, { idx })).join(', ');

    if (node.insert) {
      sql += ' ';

      sql += node.insert.visit(this);
    }

    if (node.update) {
      sql += ' ';

      sql += node.update.visit(this);
    }

    if (node.join.length) {
      sql += ' ';

      sql += node.join.map((it, idx) => it.visit(this, { idx })).join(' ');
    }

    if (node.where.length) {
      sql += ' where ';

      sql += node.where.map((it, idx) => it.visit(this, { idx })).join(' ');
    }

    if (node.groupBy.length) {
      sql += ' group by ';

      sql += node.groupBy.map((it, idx) => it.visit(this, { idx })).join(', ');
    }

    if (node.having.length) {
      sql += ' having ';

      sql += node.having.map((it, idx) => it.visit(this, { idx })).join(' ');
    }

    if (isSubQuery || node.alias) {
      sql += ')';
    }

    if (node.alias) {
      sql += ' as ' + node.alias.visit(this);
    }

    return sql;
  }

  SelectNode(node) {
    let sql = '';

    sql += node.selection.visit(this);

    if (node.alias) {
      sql += ' as ' + node.alias.visit(this);
    }

    return sql;
  }

  FromNode(node) {
    let sql = '';

    sql += node.from.visit(this);

    if (node.alias) {
      sql += ' as ' + node.alias.visit(this);
    }

    return sql;
  }

  InsertNode(node) {
    let sql = '';

    const keys = new Set();
    const rows = node.rows.map(rowNode => {
      const row = new Map();

      rowNode.properties.forEach(prop => {
        const key = prop.key.visit(this);
        const value = prop.value.visit(this);

        keys.add(key);
        row.set(key, value);
      });

      return row;
    });

    sql += '(' + Array.from(keys).join(', ') + ')';
    sql += ' values ';

    sql += rows
      .map(row => {
        const values = [];

        keys.forEach(key => {
          const value = row.get(key);
          values.push(value ? value : 'default');
        });

        return '(' + values.join(', ') + ')';
      })
      .join(', ');

    return sql;
  }

  UpdateNode(node) {
    let sql = '';

    sql += 'set ';
    sql += node.values.properties.map(it => `${it.key.visit(this)} = ${it.value.visit(this)}`).join(', ');

    return sql;
  }

  JoinNode(node) {
    let sql = '';

    sql += node.joinType + ' join ';
    sql += node.target.visit(this) + ' on ';
    sql += node.on.map((it, idx) => it.visit(this, { idx })).join(' ');

    return sql;
  }

  FilterNode(node, { idx }) {
    let sql = '';

    if (idx !== 0) {
      sql += node.bool + ' ';
    }

    if (idx !== 0 && node.not) {
      sql += 'not ';
    }

    if (node.lhs) {
      sql += node.lhs.visit(this) + ' ';
    }

    if (node.op) {
      sql += node.op.visit(this) + ' ';
    }

    if (node.rhs) {
      sql += node.rhs.visit(this);
    }

    return sql;
  }

  GroupByNode(node) {
    let sql = '';

    sql += node.groupBy.visit(this);

    return sql;
  }

  ValueNode(node) {
    return this.addBinding(node.value);
  }

  OperatorNode(node) {
    return node.operator;
  }

  IdentifierNode(node) {
    return node.ids.map(it => this.wrapIdentifier(it)).join('.');
  }

  RawNode(node) {
    const origSql = node.sql;

    let sql = '';
    let prevEnd = 0;

    node.bindings.forEach(binding => {
      const { match, index, node: bindNode } = binding;

      sql += origSql.slice(prevEnd, index);
      sql += bindNode.visit(this);

      prevEnd = index + match.length;
    });

    sql += origSql.slice(prevEnd, origSql.length);

    return sql;
  }

  addBinding(value) {
    this.bindings.push(value);

    return this.createBinding(this.bindings.length);
  }

  createBinding(index) {
    return '$' + index;
  }

  wrapIdentifier(id) {
    if (id === '*') {
      return id;
    } else {
      return this.opt.idLeftWrap + id + this.opt.idRightWrap;
    }
  }

  createParentMap(ast) {
    const parents = new Map();

    ast.visit(
      {
        AstNode(node, parent) {
          if (parent) {
            parents.set(node, parent);
          }

          node.visitAllChildren(this, node);
        }
      },
      null
    );

    return parents;
  }
}

module.exports = {
  QueryCompiler
};
