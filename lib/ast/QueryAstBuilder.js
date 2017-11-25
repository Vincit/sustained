const { FilterNode, Bool } = require('./nodes/FilterNode');
const { QueryNode } = require('./nodes');
const { AstBuilder } = require('./AstBuilder');
const { raw } = require('./RawAstBuilder');

const { parseFrom } = require('./parsers/parseFrom');
const { parseWhere } = require('./parsers/parseWhere');
const { parseSelect } = require('./parsers/parseSelect');
const { parseHaving } = require('./parsers/parseHaving');
const { parseIdentifier } = require('./parsers/parseIdentifier');

class QueryAstBuilder extends AstBuilder {
  constructor() {
    super(QueryNode.create());

    // Whenever nodes are added to AST they are passed through
    // these functions. This is needed to implement some of
    // knex's quirks.
    Object.defineProperties(this, {
      astNodeAddHooks: {
        enumerable: false,
        writable: true,
        value: []
      }
    });
  }

  static create(...args) {
    return new this(...args);
  }

  get and() {
    return this;
  }

  get or() {
    const hook = nodes => {
      nodes.forEach(node => {
        if (node instanceof FilterNode) {
          node.bool = Bool.Or;
        }
      });

      this.astNodeAddHooks = this.astNodeAddHooks.filter(it => it !== hook);
    };

    this.astNodeAddHooks.push(hook);
    return this;
  }

  get not() {
    const hook = nodes => {
      nodes.forEach(node => {
        if (node instanceof FilterNode) {
          node.not = true;
        }
      });

      this.astNodeAddHooks = this.astNodeAddHooks.filter(it => it !== hook);
    };

    this.astNodeAddHooks.push(hook);
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
    return this;
  }

  update(...args) {
    return this;
  }

  delete(...args) {
    return this;
  }

  del(...args) {
    return this;
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

  join(...args) {
    return this;
  }

  crossJoin(...args) {
    return this;
  }

  innerJoin(...args) {
    return this;
  }

  leftJoin(...args) {
    return this;
  }

  leftOuterJoin(...args) {
    return this;
  }

  rightJoin(...args) {
    return this;
  }

  rightOuterJoin(...args) {
    return this;
  }

  outerJoin(...args) {
    return this;
  }

  fullOuterJoin(...args) {
    return this;
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
    return this;
  }

  groupByRaw(...args) {
    return this;
  }

  orderBy(...args) {
    return this;
  }

  orderByRaw(...args) {
    return this;
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

  addNodes(target, nodes) {
    const hooks = this.astNodeAddHooks;

    hooks.forEach(hook => {
      hook(nodes);
    });

    nodes.forEach(node => {
      target.push(node);
    });

    return this;
  }
}

module.exports = {
  QueryAstBuilder
};
