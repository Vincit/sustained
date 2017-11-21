class AstBuilder {
  constructor(ast) {
    this.ast = ast;
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
