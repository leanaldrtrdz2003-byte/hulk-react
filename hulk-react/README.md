# HULK Web Interpreter

A modern web-based interpreter for the HULK (Havana University Language for Kompilers) programming language, featuring a sleek chat-style interface.

![HULK](https://img.shields.io/badge/HULK-Interpreter-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)

## Features

- **Full HULK Language Support**: Numbers, strings, booleans, arithmetic, comparisons
- **Functions**: User-defined functions with recursion support
- **Built-in Functions**: `print`, `sin`, `cos`, `log`
- **Modern UI**: Clean, minimalist chat-style interface
- **Persistent Functions**: Functions persist across REPL inputs

## Language Features

- Arithmetic: `+`, `-`, `*`, `/`, `%`, `^`
- Comparisons: `==`, `!=`, `<`, `<=`, `>`, `>=`
- String concatenation: `@`
- Let bindings: `let x = value in expression`
- If expressions: `if (condition) expression else expression`
- Functions: `function name(args) => expression`

## Examples

```hulk
// Basic arithmetic
2 + 3  // 5

// Functions
function square(x) => x * x;
square(5)  // 25

// Recursion
function fib(n) => if (n > 1) fib(n-1) + fib(n-2) else 1;
fib(6)  // 8

// Let bindings
let x = 10 in x * 2  // 20

// Built-ins
print("Hello, World!");
sin(0)  // 0
cos(0)  // 1
log(10, 100)  // 2
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with custom properties

## License

MIT