class AstBuilder {
  constructor(ast) {
    this.ast = ast;

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

Object.defineProperties(AstBuilder.prototype, {
  isSustainedAstBuilder: {
    enumerable: false,
    value: true
  }
});

module.exports = {
  AstBuilder
};
