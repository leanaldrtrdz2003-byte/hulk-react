// HULK Lexer
import { Token } from './types';
import { LexicalError } from './errors';

export class Lexer {
  private input: string; private pos: number = 0; private line: number = 1; private column: number = 0;
  constructor(input: string) { this.input = input; }

  tokenize(): Token[] {
    const tokens: Token[] = [];
    while (this.pos < this.input.length) {
      this.skipWhitespace();
      if (this.pos >= this.input.length) break;
      const char = this.input[this.pos];
      if (this.isDigit(char) || (char === '-' && this.isDigit(this.peek()))) tokens.push(this.readNumber());
      else if (char === '"') tokens.push(this.readString());
      else if (this.isAlpha(char)) tokens.push(this.readIdentifier());
      else tokens.push(this.readOperator());
    }
    tokens.push({ type: 'EOF', value: '', line: this.line, column: this.column });
    return tokens;
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length) {
      const c = this.input[this.pos];
      if (c === ' ' || c === '\t' || c === '\r') this.advance();
      else if (c === '\n') { this.line++; this.column = 0; this.pos++; }
      else break;
    }
  }
  private isDigit(c: string): boolean { return c >= '0' && c <= '9'; }
  private isAlpha(c: string): boolean { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'; }
  private isAlphaNumeric(c: string): boolean { return this.isAlpha(c) || this.isDigit(c); }
  private peek(): string { return this.input[this.pos + 1] || ''; }
  private advance(): string { const c = this.input[this.pos]; this.pos++; this.column++; return c; }

  private readNumber(): Token {
    let value = ''; const startLine = this.line; const startColumn = this.column;
    if (this.input[this.pos] === '-') value += this.advance();
    while (this.pos < this.input.length && (this.isDigit(this.input[this.pos]) || this.input[this.pos] === '.')) {
      if (this.input[this.pos] === '.' && value.includes('.')) break;
      value += this.advance();
    }
    return { type: 'NUMBER', value: parseFloat(value), line: startLine, column: startColumn };
  }

  private readString(): Token {
    this.advance(); let value = ''; const startLine = this.line; const startColumn = this.column;
    while (this.pos < this.input.length && this.input[this.pos] !== '"') {
      const c = this.advance();
      if (c === '\\') { const e = this.advance(); if (e === 'n') value += '\n'; else if (e === 't') value += '\t'; else value += e; }
      else value += c;
    }
    this.advance();
    return { type: 'STRING', value, line: startLine, column: startColumn };
  }

  private readIdentifier(): Token {
    let value = ''; const startLine = this.line; const startColumn = this.column;
    while (this.pos < this.input.length && this.isAlphaNumeric(this.input[this.pos])) value += this.advance();
    const keywords = ['function', 'let', 'in', 'if', 'else', 'true', 'false', 'print', 'sin', 'cos', 'log', 'PI', 'E', 'clear'];
    return { type: keywords.includes(value) ? 'KEYWORD' : 'IDENTIFIER', value, line: startLine, column: startColumn };
  }

  private readOperator(): Token {
    const char = this.advance(); const startLine = this.line; const startColumn = this.column;
    switch (char) {
      case '+': return { type: 'PLUS', value: '+', line: startLine, column: startColumn };
      case '-': return this.input[this.pos] === '>' ? (this.advance(), { type: 'ARROW', value: '=>', line: startLine, column: startColumn }) : { type: 'MINUS', value: '-', line: startLine, column: startColumn };
      case '*': return { type: 'STAR', value: '*', line: startLine, column: startColumn };
      case '/': return { type: 'SLASH', value: '/', line: startLine, column: startColumn };
      case '%': return { type: 'PERCENT', value: '%', line: startLine, column: startColumn };
      case '^': return { type: 'CARET', value: '^', line: startLine, column: startColumn };
      case '@': return { type: 'AT', value: '@', line: startLine, column: startColumn };
      case '(': return { type: 'LPAREN', value: '(', line: startLine, column: startColumn };
      case ')': return { type: 'RPAREN', value: ')', line: startLine, column: startColumn };
      case ',': return { type: 'COMMA', value: ',', line: startLine, column: startColumn };
      case '=': return this.input[this.pos] === '=' ? (this.advance(), { type: 'EQ', value: '==', line: startLine, column: startColumn }) : this.input[this.pos] === '>' ? (this.advance(), { type: 'ARROW', value: '=>', line: startLine, column: startColumn }) : { type: 'EQUAL', value: '=', line: startLine, column: startColumn };
      case '!': return this.input[this.pos] === '=' ? (this.advance(), { type: 'NE', value: '!=', line: startLine, column: startColumn }) : { type: 'KEYWORD', value: '!', line: startLine, column: startColumn };
      case '<': return this.input[this.pos] === '=' ? (this.advance(), { type: 'LE', value: '<=', line: startLine, column: startColumn }) : { type: 'LT', value: '<', line: startLine, column: startColumn };
      case '>': return this.input[this.pos] === '=' ? (this.advance(), { type: 'GE', value: '>=', line: startLine, column: startColumn }) : { type: 'GT', value: '>', line: startLine, column: startColumn };
      case ';': return { type: 'SEMICOLON', value: ';', line: startLine, column: startColumn };
      default: throw new LexicalError(`Unexpected '${char}'`);
    }
  }
}