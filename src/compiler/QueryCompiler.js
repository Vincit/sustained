import { CompiledQuery } from './CompiledQuery'

export class QueryCompiler {
  constructor(opt) {
    // Some basic options that allow modifying the compiler's
    // functionality without subclassing.
    this.opt = Object.assign(
      {
        // identifiers are wrapped on left side with this string
        idLeftWrap: '"',

        // identifiers are wrapped on right side with this string
        idRightWrap: '"',
        // optional function that generates a binding string
        //
        // example:
        //
        // createBinding(index) {
        //   return '$' + index;
        // }
        //
        createBinding: null,

        // optional function through which all identifiers are passed
        //
        // example:
        //
        // wrapIdentifier(id, origImpl) {
        //   return origImpl(_.snakeCase(id));
        // }
        //
        wrapIdentifier: null,

        // value given for missing values in multi-row insert
        defaultValueForInsert: 'default',
      },
      opt
    )

    // accumulated bindings
    this.bindings = null

    // this will be a `Map` with child node as key and parent node as value
    this.parents = null
  }

  static get CompiledQuery() {
    return CompiledQuery
  }

  static create(...args) {
    return new this(...args)
  }

  compile(ast) {
    this.bindings = []
    this.parents = this.createParentMap(ast)

    const sql = ast.visit(this)
    return new this.constructor.CompiledQuery(sql, this.bindings)
  }

  QueryNode(node) {
    const parent = this.parents.get(node)
    // knex quirk: don't wrap subquery to parens in a raw binding node.
    const wrapToParens = (!!parent && parent.type !== 'BindingNode') || !!node.alias

    let sql = ''

    // knex quirk: empty insert is a noop.
    if (node.queryType === 'insert' && (!node.insert || node.insert.rows.length === 0)) {
      return sql
    }

    if (wrapToParens) {
      sql += '('
    }

    if (node.with.length !== 0) {
      sql += 'with '

      sql += node.with.map((it, idx) => it.visit(this, { idx })).join(', ')

      sql += ' '
    }

    // select, insert, update, etc.
    sql += node.queryType

    if (node.queryType === 'select' && node.selectOptions.distinct) {
      sql += ' distinct'
    }

    if (node.queryType === 'select') {
      sql += ' '

      sql += node.select.map((it, idx) => it.visit(this, { idx })).join(', ')

      if (node.select.length === 0) {
        sql += '*'
      }
    }

    if (node.from.length !== 0) {
      if (node.queryType === 'select' || node.queryType === 'delete') {
        sql += ' from '
      } else if (node.queryType === 'insert') {
        sql += ' into '
      } else if (node.queryType === 'update') {
        sql += ' '
      }

      if (node.fromOptions.only) {
        sql += 'only '
      }

      sql += node.from.map((it, idx) => it.visit(this, { idx, useSchema: true })).join(', ')
    }

    if (node.insert) {
      sql += ' '

      sql += node.insert.visit(this)
    }

    if (node.update) {
      sql += ' '

      sql += node.update.visit(this)
    }

    if (node.join.length && node.queryType === 'select') {
      sql += ' '

      sql += node.join.map((it, idx) => it.visit(this, { idx })).join(' ')
    }

    if (node.where.length) {
      sql += ' where '

      sql += node.where.map((it, idx) => it.visit(this, { idx })).join(' ')
    }

    if (node.returning.length !== 0 && node.queryType !== 'select') {
      sql += ' returning '

      sql += node.returning.map((it, idx) => it.visit(this, { idx })).join(', ')
    }

    if (node.queryType === 'select') {
      if (node.groupBy.length) {
        sql += ' group by '

        sql += node.groupBy.map((it, idx) => it.visit(this, { idx })).join(', ')
      }

      if (node.having.length) {
        sql += ' having '

        sql += node.having.map((it, idx) => it.visit(this, { idx })).join(' ')
      }

      if (node.orderBy.length) {
        sql += ' order by '

        sql += node.orderBy.map((it, idx) => it.visit(this, { idx })).join(', ')
      }

      if (node.limit) {
        sql += ' limit ' + node.limit.visit(this)
      }

      if (node.offset) {
        sql += ' offset ' + node.offset.visit(this)
      }
    }

    if (wrapToParens) {
      sql += ')'
    }

    if (node.alias) {
      sql += ' as ' + node.alias.visit(this)
    }

    return sql
  }

  // for example FromNode and SelectNode inherit AliasableNode and
  // are compiled by this function.
  AliasableNode(node, opts) {
    let sql = ''

    sql += node.node.visit(this, opts)

    if (node.alias) {
      sql += ' as ' + node.alias.visit(this)
    }

    return sql
  }

  WithNode(node) {
    let sql = ''

    sql += node.alias.visit(this)
    sql += ' as '

    let nodeSql = node.node.visit(this)

    // knex quirk: ensure parentheses
    if (nodeSql[0] !== '(' || nodeSql[nodeSql.length - 1] !== ')') {
      nodeSql = '(' + nodeSql + ')'
    }

    sql += nodeSql

    return sql
  }

  InsertNode(node) {
    let sql = ''

    if (node.rows.length === 1 && node.rows[0].type !== 'ObjectNode') {
      return node.rows[0].visit(this)
    }

    const keys = new Set()
    const rows = node.rows.map((rowNode) => {
      const row = new Map()

      rowNode.properties.forEach((prop) => {
        const key = prop.key.visit(this)
        const value = prop.value.visit(this)

        keys.add(key)
        row.set(key, value)
      })

      return row
    })

    if (keys.size === 0) {
      return 'default values'
    }

    sql += '(' + Array.from(keys).join(', ') + ')'
    sql += ' values '

    sql += rows
      .map((row) => {
        const values = []

        keys.forEach((key) => {
          const value = row.get(key)

          values.push(value !== undefined ? value : this.opt.defaultValueForInsert)
        })

        return '(' + values.join(', ') + ')'
      })
      .join(', ')

    return sql
  }

  UpdateNode(node) {
    let sql = ''

    sql += 'set '
    sql += node.values.properties
      .map((it) => `${it.key.visit(this)} = ${it.value.visit(this)}`)
      .join(', ')

    return sql
  }

  JoinNode(node) {
    let sql = ''

    sql += node.joinType + ' join '
    sql += node.target.visit(this, { useSchema: true })

    if (node.on.length !== 0) {
      sql += ' on '
      sql += node.on.map((it, idx) => it.visit(this, { idx })).join(' ')
    }

    if (node.using.length !== 0) {
      sql += ' using '
      sql += node.using.map((it, idx) => it.visit(this, { idx })).join(', ')
    }

    return sql
  }

  FilterNode(node, { idx }) {
    let sql = ''
    let op = node.op && node.op.operator

    if (idx !== 0) {
      sql += node.bool
    }

    if (node.not) {
      if (sql) sql += ' '

      sql += 'not'
    }

    if (node.lhs) {
      if (sql) sql += ' '

      sql += node.lhs.visit(this)
    }

    if (node.op) {
      if (sql) sql += ' '

      sql += node.op.visit(this)
    }

    if (node.rhs) {
      if (sql) sql += ' '

      sql += node.rhs.visit(this)
    }

    return sql
  }

  ValueListNode(node) {
    let sql = ''

    sql += '(' + node.items.map((it, idx) => it.visit(this, { idx })).join(', ') + ')'

    return sql
  }

  ValueRangeNode(node) {
    let sql = ''

    sql += node.min.visit(this)
    sql += ' and '
    sql += node.max.visit(this)

    return sql
  }

  FilterGroupNode(node, { idx }) {
    let sql = ''

    if (idx !== 0) {
      sql += node.bool + ' '
    }

    if (node.not) {
      sql += 'not '
    }

    sql += '('
    sql += node.items.map((it, idx) => it.visit(this, { idx })).join(' ')
    sql += ')'

    return sql
  }

  OrderByNode(node) {
    let sql = ''

    sql += node.orderBy.visit(this)

    if (node.dir) {
      sql += ' ' + node.dir
    }

    return sql
  }

  GroupByNode(node) {
    let sql = ''

    sql += node.groupBy.visit(this)

    return sql
  }

  ValueNode(node) {
    if (node.value === null) {
      return 'null'
    } else {
      return this.addBinding(node.value)
    }
  }

  OperatorNode(node) {
    return node.operator
  }

  IdentifierNode(node, opts) {
    const wrappedIds = node.ids.map((it) => this.doWrapIdentifier(it))

    // Add schema if specified.
    if (opts && opts.useSchema) {
      const queryNode = this.findParentNode(node, 'QueryNode')

      if (queryNode && queryNode.schema) {
        wrappedIds.unshift(queryNode.schema.visit(this))
      }
    }

    return wrappedIds.join('.')
  }

  RawNode(node) {
    let sql = ''
    let prevEnd = 0

    const origSql = node.sql

    node.bindings.forEach((binding) => {
      const { match, index, node: bindNode } = binding

      sql += origSql.slice(prevEnd, index)
      sql += bindNode.visit(this)

      prevEnd = index + match.length
    })

    sql += origSql.slice(prevEnd, origSql.length)

    return sql
  }

  FunctionNode(node) {
    let sql = ''

    sql += node.name
    sql += '('

    sql += node.args
      .map((it, idx) => {
        const modifier = node.modifiers ? node.modifiers[idx] : null
        const argSql = it.visit(this, { idx })

        if (modifier) {
          return modifier + ' ' + argSql
        } else {
          return argSql
        }
      })
      .join(', ')

    sql += ')'

    return sql
  }

  ListNode(node) {
    return node.items.map((it, idx) => it.visit(this, { idx })).join(', ')
  }

  addBinding(value) {
    this.bindings.push(value)

    if (this.opt.createBinding) {
      return this.opt.createBinding(this.bindings.length)
    } else {
      return this.createBinding(this.bindings.length)
    }
  }

  createBinding(index) {
    return '$' + index
  }

  doWrapIdentifier(id) {
    id = id.trim()

    const arrayMatch = /\[\d+\]$/.exec(id)
    if (arrayMatch) {
      id = id.substr(0, arrayMatch.index)
    }

    if (this.opt.wrapIdentifier) {
      id = this.opt.wrapIdentifier(id, (id) => this.wrapIdentifier(id))
    } else {
      id = this.wrapIdentifier(id)
    }

    if (arrayMatch) {
      id += arrayMatch[0]
    }

    return id
  }

  wrapIdentifier(id) {
    if (id === '*') {
      return id
    } else {
      return this.opt.idLeftWrap + id + this.opt.idRightWrap
    }
  }

  createParentMap(ast) {
    const parents = new Map()

    ast.visit(
      {
        AstNode(node, parent) {
          if (parent) {
            parents.set(node, parent)
          }

          node.visitAllChildren(this, node)
        },
      },
      null
    )

    return parents
  }

  findParentNode(node, type) {
    while (node && node.type !== type) {
      node = this.parents.get(node)
    }

    return node || null
  }
}
