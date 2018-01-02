const { JoinNode } = require('../nodes');
const { AstBuilder } = require('./AstBuilder');
const { parseUsing } = require('../parsers/parseUsing');
const { parseOn } = require('../parsers/parseOn');
const { Bool } = require('../nodes/FilterNode');

class JoinAstBuilder extends AstBuilder {
  constructor({ ast, joinType, target, subQueryBuilderClass } = {}) {
    super(ast || JoinNode.create(joinType, target));

    this.subQueryBuilderClass = subQueryBuilderClass;
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
    return new this.constructor({
      ast: this.ast.clone(),
      subQueryBuilderClass: this.subQueryBuilderClass
    });
  }

  on(...args) {
    return this.addNodes(
      this.ast.on,

      parseOn(args, {
        bool: Bool.And,
        not: false,
        rhsIsIdentifier: true,
        queryBuilderClass: this.constructor,
        subQueryBuilderClass: this.subQueryBuilderClass
      })
    );
  }

  andOn(...args) {
    return this.on(...args);
  }

  orOn(...args) {
    return this.addNodes(
      this.ast.on,

      parseOn(args, {
        bool: Bool.Or,
        not: false,
        rhsIsIdentifier: true,
        queryBuilderClass: this.constructor,
        subQueryBuilderClass: this.subQueryBuilderClass
      })
    );
  }

  onValue(...args) {
    return this.addNodes(
      this.ast.on,

      parseOn(args, {
        bool: Bool.And,
        not: false,
        queryBuilderClass: this.constructor,
        subQueryBuilderClass: this.subQueryBuilderClass
      })
    );
  }

  orOnValue(...args) {
    return this.addNodes(
      this.ast.on,

      parseOn(args, {
        bool: Bool.Or,
        not: false,
        queryBuilderClass: this.constructor,
        subQueryBuilderClass: this.subQueryBuilderClass
      })
    );
  }

  onRaw(...args) {
    return this.onValue(raw(...args));
  }

  andOnRaw(...args) {
    return this.onValue(raw(...args));
  }

  orOnRaw(...args) {
    return this.orOnValue(raw(...args));
  }

  onNot(...args) {
    return this.addNodes(
      this.ast.on,

      parseOn(args, {
        bool: Bool.And,
        not: true,
        queryBuilderClass: this.constructor,
        subQueryBuilderClass: this.subQueryBuilderClass
      })
    );
  }

  andOnNot(...args) {
    return this.onNot(...args);
  }

  orOnNot(...args) {
    return this.addNodes(
      this.ast.on,

      parseOn(args, {
        bool: Bool.Or,
        not: true,
        queryBuilderClass: this.constructor,
        subQueryBuilderClass: this.subQueryBuilderClass
      })
    );
  }

  onIn(lhs, rhs) {
    return this.onValue(lhs, 'in', rhs);
  }

  andOnIn(...args) {
    return this.onIn(...args);
  }

  orOnIn(lhs, rhs) {
    return this.orOnValue(lhs, 'in', rhs);
  }

  onNotIn(lhs, rhs) {
    return this.onNot(lhs, 'in', rhs);
  }

  andOnNotIn(...args) {
    return this.onNotIn(...args);
  }

  orOnNotIn(lhs, rhs) {
    return this.orOnNot(lhs, 'in', rhs);
  }

  onBetween(lhs, rhs) {
    return this.onValue(lhs, 'between', rhs);
  }

  andOnBetween(...args) {
    return this.onBetween(...args);
  }

  orOnBetween(lhs, rhs) {
    return this.orOnValue(lhs, 'between', rhs);
  }

  onNotBetween(lhs, rhs) {
    return this.onNot(lhs, 'between', rhs);
  }

  andOnNotBetween(...args) {
    return this.onNotBetween(...args);
  }

  orOnNotBetween(lhs, rhs) {
    return this.orOnNot(lhs, 'between', rhs);
  }

  onExists(arg) {
    return this.onValue(null, 'exists', arg);
  }

  andOnExists(...args) {
    return this.onExists(...args);
  }

  orOnExists(arg) {
    return this.orOnValue(null, 'exists', arg);
  }

  onNotExists(arg) {
    return this.onNot(null, 'exists', arg);
  }

  andOnNotExists(...args) {
    return this.onNotExists(...args);
  }

  orOnNotExists(arg) {
    return this.orOnNot(null, 'exists', arg);
  }

  onNull(arg) {
    return this.onValue(arg, 'is', null);
  }

  andOnNull(...args) {
    return this.onNull(...args);
  }

  onNotNull(arg) {
    return this.onNot(arg, 'is', null);
  }

  andOnNotNull(...args) {
    return this.onNotNull(...args);
  }

  orOnNull(arg) {
    return this.orOnValue(arg, 'is', null);
  }

  orOnNotNull(arg) {
    return this.orOnNot(arg, 'is', null);
  }

  using(...args) {
    return this.addNodes(this.ast.using, parseUsing(args));
  }
}

module.exports = {
  JoinAstBuilder
};
