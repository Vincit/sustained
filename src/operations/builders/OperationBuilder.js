export class OperationBuilder {
  constructor(operationNode) {
    this.operationNode = operationNode;
    // Whenever nodes are added to operation tree they are passed through
    // these functions. This is needed to implement some of
    // knex's quirks.
    this.operationNodeAddHooks = [];
  }

  addNodes(target, nodes) {
    const hooks = this.operationNodeAddHooks;

    hooks.forEach(hook => {
      hook(nodes);
    });

    nodes.forEach(node => {
      target.push(node);
    });

    return this;
  }

  runHooks(node) {
    const hooks = this.operationNodeAddHooks;
    const nodes = [node];

    hooks.forEach(hook => {
      hook(nodes);
    });

    return node;
  }
}

Object.defineProperties(OperationBuilder.prototype, {
  isSustainedOperationBuilder: {
    enumerable: false,
    value: true
  }
});
