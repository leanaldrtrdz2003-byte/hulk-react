import { HULKValue } from './types';
import { SemanticError } from './errors';
export type BuiltinFunction = (args: HULKValue[]) => HULKValue;
const builtins: Record<string, BuiltinFunction> = {
  print: (args) => { const v = args.map(a => a === undefined ? 'void' : typeof a === 'function' ? '<function>' : String(a)).join(' '); console.log(v); return v; },
  clear: () => 'CLEAR',
  sin: (args) => { if (args.length !== 1) throw new SemanticError('sin takes 1 arg'); return Math.sin(toNumber(args[0])); },
  cos: (args) => { if (args.length !== 1) throw new SemanticError('cos takes 1 arg'); return Math.cos(toNumber(args[0])); },
  log: (args) => { if (args.length !== 2) throw new SemanticError('log takes 2 args'); const [b, x] = [toNumber(args[0]), toNumber(args[1])]; if (b <= 0 || b === 1) throw new SemanticError('log base invalid'); if (x <= 0) throw new SemanticError('log value must be positive'); return Math.log(x) / Math.log(b); }
};
function toNumber(v: HULKValue): number { if (typeof v === 'number') return v; if (typeof v === 'string') { const n = parseFloat(v); if (isNaN(n)) throw new SemanticError(`Cannot convert "${v}"`); return n; } if (typeof v === 'boolean') return v ? 1 : 0; throw new SemanticError(`Cannot convert ${typeof v}`); }
export function getBuiltin(name: string) { return builtins[name]; }
export function isBuiltin(name: string) { return name in builtins; }