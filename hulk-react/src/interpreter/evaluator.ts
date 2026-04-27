import { ASTNode, HULKValue, NumberNode, StringNode, BooleanNode, IdentifierNode, BinaryNode, UnaryNode, CallNode, FunctionNode, LetNode, IfNode, FunctionValue } from './types';
import { EvalContext, getGlobalContext } from './context';
import { getBuiltin, isBuiltin } from './builtins';
import { SemanticError } from './errors';

export function evaluate(ast: ASTNode, context: EvalContext = getGlobalContext()): HULKValue {
  switch (ast.type) {
    case 'Number': return ast.value;
    case 'String': return ast.value;
    case 'Boolean': return ast.value;
    case 'Identifier': if (ast.name === 'PI') return Math.PI; if (ast.name === 'E') return Math.E; const v = context.getVariable(ast.name); if (v !== undefined) return v; const f = context.getFunction(ast.name); if (f) return f; throw new SemanticError(`Undefined: ${ast.name}`);
    case 'Binary': { const l = evaluate(ast.left, context); const r = evaluate(ast.right, context); switch (ast.op) { case '+': return typeof l === 'string' || typeof r === 'string' ? String(l) + String(r) : toN(l) + toN(r); case '-': return toN(l) - toN(r); case '*': return toN(l) * toN(r); case '/': const d = toN(r); if (d === 0) throw new SemanticError('Division by zero'); return toN(l) / d; case '%': return toN(l) % toN(r); case '^': return Math.pow(toN(l), toN(r)); case '@': return String(l) + String(r); case '==': return l === r; case '!=': return l !== r; case '<': return toN(l) < toN(r); case '<=': return toN(l) <= toN(r); case '>': return toN(l) > toN(r); case '>=': return toN(l) >= toN(r); default: throw new SemanticError(`Unknown op: ${ast.op}`); } }
    case 'Unary': return ast.op === '-' ? -toN(evaluate(ast.operand, context)) : evaluate(ast.operand, context);
    case 'Call': { const { name, args } = ast; if (isBuiltin(name)) { const a = args.map(arg => evaluate(arg, context)); return getBuiltin(name)!(a); } const fn = context.getFunction(name); if (!fn) throw new SemanticError(`Unknown: ${name}`); return callFn(fn, args, context); }
    case 'Function': context.setFunction(ast.name, { type: 'function', params: ast.params, body: ast.body }); return undefined;
    case 'Let': { const c = new EvalContext(); for (const [k, v] of (context as any).functions) c.setFunction(k, v); for (const b of ast.bindings) c.setVariable(b.name, evaluate(b.value, c)); return evaluate(ast.body, c); }
    case 'If': return evaluate(ast.condition, context) ? evaluate(ast.then, context) : evaluate(ast.else, context);
    default: throw new SemanticError('Unknown node');
  }
}

function callFn(fn: FunctionValue, args: ASTNode[], parent: EvalContext): HULKValue {
  const c = new EvalContext(); for (const [k, v] of (parent as any).functions) c.setFunction(k, v);
  const av = args.map(a => evaluate(a, parent)); if (av.length !== fn.params.length) throw new SemanticError(`Expected ${fn.params.length}, got ${av.length}`);
  fn.params.forEach((p, i) => c.setVariable(p, av[i])); return evaluate(fn.body, c);
}

function toN(v: HULKValue): number { if (typeof v === 'number') return v; if (typeof v === 'string') { const n = parseFloat(v); if (isNaN(n)) throw new SemanticError(`"${v}" not a number`); return n; } if (typeof v === 'boolean') return v ? 1 : 0; throw new SemanticError(`"${v}" not a number`); }