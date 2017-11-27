const { JoinNode } = require('../nodes');
const { AstBuilder } = require('./AstBuilder');
const { parseOn } = require('../parsers/parseOn');
const { Bool } = require('../nodes/FilterNode');

class JoinAstBuilder extends AstBuilder {
  constructor({ joinType, target }) {
    super(JoinNode.create(joinType, target, []));
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

  on(...args) {
    return this.addNodes(
      this.ast.on,
      parseOn(args, {
        bool: Bool.And,
        not: false,
        astBuilderClass: this.constructor,
        rhsIsIdentifier: true
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
        astBuilderClass: this.constructor,
        rhsIsIdentifier: true
      })
    );
  }

  onValue(...args) {
    return this.addNodes(
      this.ast.on,
      parseOn(args, { bool: Bool.And, not: false, astBuilderClass: this.constructor })
    );
  }

  orOnValue(...args) {
    return this.addNodes(
      this.ast.on,
      parseOn(args, { bool: Bool.Or, not: false, astBuilderClass: this.constructor })
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
      parseOn(args, { bool: Bool.And, not: true, astBuilderClass: this.constructor })
    );
  }

  andOnNot(...args) {
    return this.onNot(...args);
  }

  orOn(...args) {
    return this.addNodes(
      this.ast.on,
      parseOn(args, { bool: Bool.Or, not: false, astBuilderClass: this.constructor })
    );
  }

  orOnNot(...args) {
    return this.addNodes(
      this.ast.on,
      parseOn(args, { bool: Bool.Or, not: true, astBuilderClass: this.constructor })
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
}

module.exports = {
  JoinAstBuilder
};
