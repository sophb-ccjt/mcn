# MCN (Macro-based Cube Notation) Grammar

MCN allows you to write cube algorithms with macros, comments, and standard move notation.

---

## Basic Syntax

- Moves: `U D F B L R u d f b l r M E S x y z`
- Wide moves: `Uw`, `Rw`, `Fw`, etc.
- Optional counts: `U2'`, `R3`, `F12`
  - Disallowed: `U0`, `D1`, `B-1` (fails to parse)
- Optional prime: `U'`
- Move ranges: `2-5U`
- Parentheses for repetitions: `(R U R')2`

---

## Macros

Definition:  
```
MacroName = algorithm
```

Example:  
```
A = R U R' U'
```

Usage:  
```
{A} U2 {A}'
```

Nesting: Macros can reference other macros.  

Restrictions:  
- Macro names cannot contain `{`, `}`, `=`, or newlines.
- Curly braces (`{}`) are used to reference macros.

---

## Comments

- Lines starting with # are comments:
```
# This is a comment
```

- Inline comments after code are removed automatically:
```
R U R' U' # get sexy with it
```

---

## Algorithm Line Rules

- A single algorithm line can contain:
  - Moves
  - Macro references
  - Parentheses for repetitions
- Moves and macros may be separated by spaces or tabs.
- Entire line is matched using `algRegex`.

---

## Example MCN File

```
# macros
A = R U R' U' # sexy move
B = {A} U2 {A}'

# alg using macros
{A} U {B}
```

Expanded output:  
```
R U R' U' U R U R' U' U2 R U R' U'
```
---

## Advanced Notes

- Expansion Limit: Nested macros are expanded up to 128 iterations to prevent infinite recursion.
- Undefined Macros: Replaced with `∅` during expansion and logged as a warning.
- Whitespace Handling: Tabs and spaces are ignored between moves.
