class AstBuilder {
  constructor(ast) {
    this.ast = ast;
    // Whenever nodes are added to AST they are passed through
    // these functions. This is needed to implement some of
    // knex's quirks.
    this.astNodeAddHooks = [];
  }

  static create(...args) {
    return new this(...args);
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

  runHooks(node) {
    const hooks = this.astNodeAddHooks;
    const nodes = [node];

    hooks.forEach(hook => {
      hook(nodes);
    });

    return node;
  }
}

Object.defineProperties(AstBuilder.prototype, {
  isSustainedAstBuilder: {
    enumerable: false,
    value: true
  }
});

export {
  AstBuilder
};
