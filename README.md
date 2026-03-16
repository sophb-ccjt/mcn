# MCN (Macro-based Cube Notation)

MCN is a JavaScript library for defining, parsing, and expanding Rubik's Cube algorithms using **macros**. It allows you to define reusable algorithm chunks, nest them, and expand them into full sequences.

---

## Installation
### Node.js (CommonJS)
```bash
npm install sophb-ccjt/mcn
```

### Browser
Add this to your HTML file:
```html
<script src='https://cdn.jsdelivr.net/gh/sophb-ccjt/mcn@main/src/mcn.js'></script>
```

## Usage
### NodeJS
```js
const { MCN } = require('./mcn.js');

const mcnText = `
# Example MCN
A = R U R' U'
B = {A} U2 {A}'
{A} U {B} 
`;

const parsed = MCN.parse(mcnText);

console.log(parsed.vars);
// { A: "R U R' U'", B: "R U R' U' U2 R U R' U'" }

console.log(parsed.algs);
// [ "{A} U {B}" ]

console.log(parsed.expAlgs);
// [ "R U R' U' U R U R' U' U2 R U R' U'" ]
```

### Browser
A global `MCN` variable is exposed.

```js
const mcnText = `
# Example MCN
A = R U R' U'
B = {A} U2 {A}'
{A} U {B} 
`;

const parsed = MCN.parse(mcnText);

console.log(parsed.vars);
// { A: 'R U R\' U\'', B: 'R U R\' U\' U2 R U R\' U\'' }

console.log(parsed.algs);
// [ '{A} U {B}' ]

console.log(parsed.expAlgs);
// [ 'R U R\' U\' U R U R\' U\' U2 R U R\' U\'' ]
```
