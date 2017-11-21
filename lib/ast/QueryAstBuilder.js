const { QueryNode } = require('./nodes/QueryNode');
const { AstBuilder } = require('./AstBuilder');

const { parseFrom } = require('./parsers/parseFrom');
const { parseWhere } = require('./parsers/parseWhere');
const { parseSelect } = require('./parsers/parseSelect');
const { parseIdentifier } = require('./parsers/parseIdentifier');

class QueryAstBuilder extends AstBuilder {
  constructor() {
    super(QueryNode.create());
  }

  static create() {
    return new this();
  }

  select(...args) {
    this.ast.select.push(...parseSelect(args));
    return this;
  }

  from(...args) {
    this.ast.from.push(...parseFrom(args));
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
      ...parseWhere(args, { bool: 'and', not: false, astBuilderClass: this.constructor })
    );
    return this;
  }

  andWhere(...args) {
    return this.where(...args);
  }

  whereNot(...args) {
    this.ast.where.push(
      ...parseWhere(args, { bool: 'and', not: true, astBuilderClass: this.constructor })
    );
    return this;
  }

  andWhereNot(...args) {
    return this.whereNot(...args);
  }

  orWhere(...args) {
    this.ast.where.push(
      ...parseWhere(args, { bool: 'or', not: false, astBuilderClass: this.constructor })
    );
    return this;
  }

  orWhereNot(...args) {
    this.ast.where.push(
      ...parseWhere(args, { bool: 'or', not: true, astBuilderClass: this.constructor })
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
    return this.where(lhs, 'not in', rhs);
  }

  andWhereNotIn(...args) {
    return this.whereNotIn(...args);
  }

  orWhereNotIn(lhs, rhs) {
    return this.orWhere(lhs, 'not in', rhs);
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
    return this.where(lhs, 'not between', rhs);
  }

  andWhereNotBetween(...args) {
    return this.whereNotBetween(...args);
  }

  orWhereNotBetween(lhs, rhs) {
    return this.orWhere(lhs, 'not between', rhs);
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
    return this.where(null, 'not exists', arg);
  }

  andWhereNotExists(...args) {
    return this.whereNotExists(...args);
  }

  orWhereNotExists(arg) {
    return this.orWhere(null, 'not exists', arg);
  }

  as(...args) {
    this.ast.alias = parseIdentifier(...args);
    return this;
  }
}

module.exports = {
  QueryAstBuilder
};
