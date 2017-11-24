const { Bool } = require('./nodes/WhereNode');
const { QueryNode } = require('./nodes');
const { AstBuilder } = require('./AstBuilder');

const { parseFrom } = require('./parsers/parseFrom');
const { parseWhere } = require('./parsers/parseWhere');
const { parseSelect } = require('./parsers/parseSelect');
const { parseIdentifier } = require('./parsers/parseIdentifier');

class QueryAstBuilder extends AstBuilder {
  constructor() {
    super(QueryNode.create());
  }

  static create(...args) {
    return new this(...args);
  }

  select(...args) {
    this.ast.select.push(...parseSelect(args));
    return this;
  }

  from(...args) {
    // Knex overrides `from` clause each time `from` method is called.
    this.ast.from = parseFrom(args);
    return this;
  }

  into(...args) {
    return this.from(...args);
  }

  table(...args) {
    return this.from(...args);
  }

  where(...args) {
    this.ast.where.push(
      ...parseWhere(args, { bool: Bool.And, not: false, astBuilderClass: this.constructor })
    );
    return this;
  }

  andWhere(...args) {
    return this.where(...args);
  }

  whereNot(...args) {
    this.ast.where.push(
      ...parseWhere(args, { bool: Bool.And, not: true, astBuilderClass: this.constructor })
    );
    return this;
  }

  andWhereNot(...args) {
    return this.whereNot(...args);
  }

  orWhere(...args) {
    this.ast.where.push(
      ...parseWhere(args, { bool: Bool.Or, not: false, astBuilderClass: this.constructor })
    );
    return this;
  }

  orWhereNot(...args) {
    this.ast.where.push(
      ...parseWhere(args, { bool: Bool.Or, not: true, astBuilderClass: this.constructor })
    );
    return this;
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

  as(...args) {
    this.ast.alias = parseIdentifier(...args);
    return this;
  }
}

module.exports = {
  QueryAstBuilder
};
