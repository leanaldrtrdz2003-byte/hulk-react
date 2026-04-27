import { HULKValue, FunctionValue } from './types';
export class EvalContext { private variables = new Map<string, HULKValue>(); private functions = new Map<string, FunctionValue>(); constructor() { this.setVariable('PI', Math.PI); this.setVariable('E', Math.E); } getVariable(n: string) { return this.variables.get(n); } setVariable(n: string, v: HULKValue) { this.variables.set(n, v); } getFunction(n: string) { return this.functions.get(n); } setFunction(n: string, f: FunctionValue) { this.functions.set(n, f); } }
let globalContext: EvalContext | null = null;
export function getGlobalContext(): EvalContext { if (!globalContext) globalContext = new EvalContext(); return globalContext; }
export function resetGlobalContext(): void { globalContext = new EvalContext(); }