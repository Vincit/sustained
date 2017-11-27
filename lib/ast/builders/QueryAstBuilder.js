const { FilterNode, Bool } = require('../nodes/FilterNode');
const { JoinAstBuilder } = require('./JoinAstBuilder');
const { QueryType } = require('../nodes/QueryNode');
const { QueryNode } = require('../nodes');
const { AstBuilder } = require('./AstBuilder');
const { raw } = require('./RawAstBuilder');

const { parseFrom } = require('../parsers/parseFrom');
const { parseJoin } = require('../parsers/parseJoin');
const { parseWhere } = require('../parsers/parseWhere');
const { parseSelect } = require('../parsers/parseSelect');
const { parseHaving } = require('../parsers/parseHaving');
const { parseInsert } = require('../parsers/parseInsert');
const { parseUpdate } = require('../parsers/parseUpdate');
const { parseOrderBy } = require('../parsers/parseOrderBy');
const { parseGroupBy } = require('../parsers/parseGroupBy');
const { parseIdentifier } = require('../parsers/parseIdentifier');

class QueryAstBuilder extends AstBuilder {
  constructor() {
    super(QueryNode.create());
  }

  static create(...args) {
    return new this(...args);
  }

  static get JoinBuilder() {
    return JoinAstBuilder;
  }

  get and() {
    return this;
  }

  get or() {
    forNextAddedNodes(this, FilterNode, node => {
      node.bool = Bool.Or;
    });

    return this;
  }

  get not() {
    forNextAddedNodes(this, FilterNode, node => {
      node.not = true;
    });

    return this;
  }

  clone() {
    return this;
  }

  select(...args) {
    this.addNodes(this.ast.select, parseSelect(args, { astBuilderClass: this.constructor }));
    return this;
  }

  from(...args) {
    // knex quirk: from overrides previous calls.
    this.ast.from = [];
    this.addNodes(this.ast.from, parseFrom(args));
    return this;
  }

  into(...args) {
    return this.from(...args);
  }

  table(...args) {
    return this.from(...args);
  }

  insert(...args) {
    this.ast.queryType = QueryType.Insert;
    this.ast.insert = parseInsert(args, { astBuilderClass: this.constructor });
    return this;
  }

  update(...args) {
    this.ast.queryType = QueryType.Update;
    this.ast.update = parseUpdate(args, { astBuilderClass: this.constructor });
    return this;
  }

  delete(...args) {
    this.ast.queryType = QueryType.Delete;
    return this;
  }

  del(...args) {
    return this.delete(...args);
  }

  where(...args) {
    return this.addNodes(
      this.ast.where,
      parseWhere(args, { bool: Bool.And, not: false, astBuilderClass: this.constructor })
    );
  }

  andWhere(...args) {
    return this.where(...args);
  }

  whereRaw(...args) {
    return this.where(raw(...args));
  }

  andWhereRaw(...args) {
    return this.andWhere(raw(...args));
  }

  orWhereRaw(...args) {
    return this.orWhere(raw(...args));
  }

  whereNot(...args) {
    return this.addNodes(
      this.ast.where,
      parseWhere(args, { bool: Bool.And, not: true, astBuilderClass: this.constructor })
    );
  }

  andWhereNot(...args) {
    return this.whereNot(...args);
  }

  orWhere(...args) {
    return this.addNodes(
      this.ast.where,
      parseWhere(args, { bool: Bool.Or, not: false, astBuilderClass: this.constructor })
    );
  }

  orWhereNot(...args) {
    return this.addNodes(
      this.ast.where,
      parseWhere(args, { bool: Bool.Or, not: true, astBuilderClass: this.constructor })
    );
  }

  whereIn(lhs, rhs) {
    return this.where(lhs, 'in', rhs);
  }

  andWhereIn(...args) {
    return this.whereIn(...args);
  }

  orWhereIn(lhs, rhs) {
    return this.orWhere(lhs, 'in', rhs);
  }

  whereNotIn(lhs, rhs) {
    return this.whereNot(lhs, 'in', rhs);
  }

  andWhereNotIn(...args) {
    return this.whereNotIn(...args);
  }

  orWhereNotIn(lhs, rhs) {
    return this.orWhereNot(lhs, 'in', rhs);
  }

  whereBetween(lhs, rhs) {
    return this.where(lhs, 'between', rhs);
  }

  andWhereBetween(...args) {
    return this.whereBetween(...args);
  }

  orWhereBetween(lhs, rhs) {
    return this.orWhere(lhs, 'between', rhs);
  }

  whereNotBetween(lhs, rhs) {
    return this.whereNot(lhs, 'between', rhs);
  }

  andWhereNotBetween(...args) {
    return this.whereNotBetween(...args);
  }

  orWhereNotBetween(lhs, rhs) {
    return this.orWhereNot(lhs, 'between', rhs);
  }

  whereExists(arg) {
    return this.where(null, 'exists', arg);
  }

  andWhereExists(...args) {
    return this.whereExists(...args);
  }

  orWhereExists(arg) {
    return this.orWhere(null, 'exists', arg);
  }

  whereNotExists(arg) {
    return this.whereNot(null, 'exists', arg);
  }

  andWhereNotExists(...args) {
    return this.whereNotExists(...args);
  }

  orWhereNotExists(arg) {
    return this.orWhereNot(null, 'exists', arg);
  }

  whereNull(arg) {
    return this.where(arg, 'is', null);
  }

  andWhereNull(...args) {
    return this.whereNull(...args);
  }

  whereNotNull(arg) {
    return this.whereNot(arg, 'is', null);
  }

  andWhereNotNull(...args) {
    return this.whereNotNull(...args);
  }

  orWhereNull(arg) {
    return this.orWhere(arg, 'is', null);
  }

  orWhereNotNull(arg) {
    return this.orWhereNot(arg, 'is', null);
  }

  having(...args) {
    return this.addNodes(
      this.ast.having,
      parseHaving(args, { bool: Bool.And, not: false, astBuilderClass: this.constructor })
    );
  }

  andHaving(...args) {
    return this.having(...args);
  }

  havingRaw(...args) {
    return this.having(raw(...args));
  }

  andHavingRaw(...args) {
    return this.andHaving(raw(...args));
  }

  orHavingRaw(...args) {
    return this.orHaving(raw(...args));
  }

  havingNot(...args) {
    return this.addNodes(
      this.ast.having,
      parseHaving(args, { bool: Bool.And, not: true, astBuilderClass: this.constructor })
    );
  }

  andHavingNot(...args) {
    return this.havingNot(...args);
  }

  orHaving(...args) {
    return this.addNodes(
      this.ast.having,
      parseHaving(args, { bool: Bool.Or, not: false, astBuilderClass: this.constructor })
    );
  }

  orHavingNot(...args) {
    return this.addNodes(
      this.ast.having,
      parseHaving(args, { bool: Bool.Or, not: true, astBuilderClass: this.constructor })
    );
  }

  havingIn(lhs, rhs) {
    return this.having(lhs, 'in', rhs);
  }

  andHavingIn(...args) {
    return this.havingIn(...args);
  }

  orHavingIn(lhs, rhs) {
    return this.orHaving(lhs, 'in', rhs);
  }

  havingNotIn(lhs, rhs) {
    return this.havingNot(lhs, 'in', rhs);
  }

  andHavingNotIn(...args) {
    return this.havingNotIn(...args);
  }

  orHavingNotIn(lhs, rhs) {
    return this.orHavingNot(lhs, 'in', rhs);
  }

  havingBetween(lhs, rhs) {
    return this.having(lhs, 'between', rhs);
  }

  andHavingBetween(...args) {
    return this.havingBetween(...args);
  }

  orHavingBetween(lhs, rhs) {
    return this.orHaving(lhs, 'between', rhs);
  }

  havingNotBetween(lhs, rhs) {
    return this.havingNot(lhs, 'between', rhs);
  }

  andHavingNotBetween(...args) {
    return this.havingNotBetween(...args);
  }

  orHavingNotBetween(lhs, rhs) {
    return this.orHavingNot(lhs, 'between', rhs);
  }

  havingExists(arg) {
    return this.having(null, 'exists', arg);
  }

  andHavingExists(...args) {
    return this.havingExists(...args);
  }

  orHavingExists(arg) {
    return this.orHaving(null, 'exists', arg);
  }

  havingNotExists(arg) {
    return this.havingNot(null, 'exists', arg);
  }

  andHavingNotExists(...args) {
    return this.havingNotExists(...args);
  }

  orHavingNotExists(arg) {
    return this.orHavingNot(null, 'exists', arg);
  }

  havingNull(arg) {
    return this.having(arg, 'is', null);
  }

  andHavingNull(...args) {
    return this.havingNull(...args);
  }

  havingNotNull(arg) {
    return this.havingNot(arg, 'is', null);
  }

  andHavingNotNull(...args) {
    return this.havingNotNull(...args);
  }

  orHavingNull(arg) {
    return this.orHaving(arg, 'is', null);
  }

  orHavingNotNull(arg) {
    return this.orHavingNot(arg, 'is', null);
  }

  specificJoin(joinType, args) {
    return this.addNodes(
      this.ast.join,
      parseJoin(args, {
        astBuilderClass: this.constructor,
        joinAstBuilderClass: this.constructor.JoinBuilder,
        joinType
      })
    );
  }

  join(...args) {
    return this.specificJoin('inner', args);
  }

  crossJoin(...args) {
    return this.specificJoin('cross', args);
  }

  innerJoin(...args) {
    return this.specificJoin('inner', args);
  }

  leftJoin(...args) {
    return this.specificJoin('left', args);
  }

  leftOuterJoin(...args) {
    return this.specificJoin('left outer', args);
  }

  rightJoin(...args) {
    return this.specificJoin('right', args);
  }

  rightOuterJoin(...args) {
    return this.specificJoin('right outer', args);
  }

  outerJoin(...args) {
    return this.specificJoin('outer', args);
  }

  fullOuterJoin(...args) {
    return this.specificJoin('full outer', args);
  }

  joinRaw(...args) {
    return this.join(raw(...args));
  }

  as(...args) {
    this.ast.alias = parseIdentifier(...args);
    return this;
  }

  withSchema(...args) {
    return this;
  }

  distinct(...args) {
    return this;
  }

  limit(...args) {
    return this;
  }

  offset(...args) {
    return this;
  }

  first(...args) {
    return this;
  }

  union(...args) {
    return this;
  }

  unionAll(...args) {
    return this;
  }

  min(...args) {
    return this;
  }

  max(...args) {
    return this;
  }

  count(...args) {
    return this;
  }

  sum(...args) {
    return this;
  }

  sumDistinct(...args) {
    return this;
  }

  avg(...args) {
    return this;
  }

  avgDistinct(...args) {
    return this;
  }

  countDistinct(...args) {
    return this;
  }

  groupBy(...args) {
    return this.addNodes(
      this.ast.groupBy,
      parseGroupBy(args, { astBuilderClass: this.constructor })
    );
  }

  groupByRaw(...args) {
    return this.groupBy(raw(...args));
  }

  orderBy(...args) {
    return this.addNodes(
      this.ast.orderBy,
      parseOrderBy(args, { astBuilderClass: this.constructor })
    );
  }

  orderByRaw(...args) {
    return this.orderBy(raw(...args));
  }

  with(...args) {
    return this;
  }

  clearSelect() {
    this.ast.select = [];
    return this;
  }

  clearWhere() {
    this.ast.where = [];
    return this;
  }

  truncate() {
    return this;
  }

  forUpdate() {
    return this;
  }

  modify() {
    return this;
  }

  fromJS(obj) {
    Object.keys(obj).forEach(key => {
      const value = obj[key];

      if (Array.isArray(value)) {
        this[key].apply(this, value);
      } else {
        this[key].call(this, value);
      }
    });

    return this;
  }
}

function forNextAddedNodes(builder, NodeClass, hook) {
  const onceHook = nodes => {
    nodes.forEach(node => {
      if (node instanceof NodeClass) {
        hook(node);
      }
    });

    builder.astNodeAddHooks = builder.astNodeAddHooks.filter(it => it !== onceHook);
  };

  builder.astNodeAddHooks.push(onceHook);
}

module.exports = {
  QueryAstBuilder
};
