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

    sql += 'select ';

    sql += node.select.map((it, idx) => it.visit(this, { idx })).join(', ');

    sql += ' from ';

    sql += node.from.map((it, idx) => it.visit(this, { idx })).join(', ');

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
