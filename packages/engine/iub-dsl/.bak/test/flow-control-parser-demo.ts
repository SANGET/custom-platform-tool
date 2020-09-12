const A = {};
const B = {};
const C = {};
const D = {};

function expressionParser(expression, context) {}

const context = {
  currValue: {},
};

const a = expressionParser(A.expression, context);
context.currValue = a;

const b = expressionParser(B.expression, context);
const c = expressionParser(C.expression, context);

context[B.variable] = b;
context[C.variable] = c;

if (B.flowExpression(context)) {
  context.currValue = b;
} else if (C.flowExpression(context)) {
  context.currValue = c;
}

context.currValue = D.expression(context);
