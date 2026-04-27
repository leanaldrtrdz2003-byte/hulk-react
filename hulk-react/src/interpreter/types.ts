// AST Node Types for HULK Interpreter

export type ASTNode =
  | NumberNode
  | StringNode
  | BooleanNode
  | IdentifierNode
  | BinaryNode
  | UnaryNode
  | CallNode
  | FunctionNode
  | LetNode
  | IfNode;

export interface NumberNode { type: 'Number'; value: number; }
export interface StringNode { type: 'String'; value: string; }
export interface BooleanNode { type: 'Boolean'; value: boolean; }
export interface IdentifierNode { type: 'Identifier'; name: string; }
export interface BinaryNode { type: 'Binary'; op: string; left: ASTNode; right: ASTNode; }
export interface UnaryNode { type: 'Unary'; op: string; operand: ASTNode; }
export interface CallNode { type: 'Call'; name: string; args: ASTNode[]; }
export interface FunctionNode { type: 'Function'; name: string; params: string[]; body: ASTNode; }
export interface LetNode { type: 'Let'; bindings: Binding[]; body: ASTNode; }
export interface Binding { name: string; value: ASTNode; }
export interface IfNode { type: 'If'; condition: ASTNode; then: ASTNode; else: ASTNode; }

export type HULKValue = number | string | boolean | void | FunctionValue;
export interface FunctionValue { type: 'function'; params: string[]; body: ASTNode; }

export type TokenType = 'NUMBER' | 'STRING' | 'IDENTIFIER' | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH' | 'PERCENT' | 'CARET' | 'EQ' | 'NE' | 'LT' | 'LE' | 'GT' | 'GE' | 'AT' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'ARROW' | 'EQUAL' | 'KEYWORD' | 'DOT' | 'SEMICOLON' | 'EOF';
export interface Token { type: TokenType; value: string | number; line: number; column: number; }