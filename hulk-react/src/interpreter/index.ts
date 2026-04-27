import { Lexer } from './lexer'; import { Parser, parse } from './parser'; import { evaluate } from './evaluator'; import { getGlobalContext, resetGlobalContext } from './context'; import type { ASTNode, HULKValue } from './types'; import { HULKError, LexicalError, SyntaxError, SemanticError } from './errors';
export { HULKError, LexicalError, SyntaxError, SemanticError }; export type { ASTNode, HULKValue };
export function parseCode(source: string): ASTNode { const parser = new Parser(new Lexer(source).tokenize()); return parser.parse(); }
export function execute(source: string): HULKValue { return evaluate(parseCode(source)); }
export function reset() { resetGlobalContext(); }
export { getGlobalContext };