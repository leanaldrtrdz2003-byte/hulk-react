export class HULKError extends Error { constructor(message: string) { super(message); this.name = this.constructor.name; } }
export class LexicalError extends HULKError { constructor(message: string) { super(`Lexical Error: ${message}`); } }
export class SyntaxError extends HULKError { constructor(message: string) { super(`Syntax Error: ${message}`); } }
export class SemanticError extends HULKError { constructor(message: string) { super(`Semantic Error: ${message}`); } }