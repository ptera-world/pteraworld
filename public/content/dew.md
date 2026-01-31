minimal expression language that compiles to multiple backends. parse once, emit to WGSL, Cranelift, Lua, GLSL, OpenCL, CUDA, C, Rust, or TokenStream.

## what it is

a small language for mathematical expressions with let bindings and optional conditionals. it fills the gap between "i need a formula" and "i need that formula to run on the GPU, in a JIT, or in a scripting runtime."

domain crates provide independent type systems (scalar math, linear algebra, complex numbers, quaternions), each with its own function registry and eval. expressions get constant folding and algebraic simplification. there's editor support via VSCode/TextMate/tree-sitter grammars and WASM bindings with module profiles.

## Related projects

- [unshape](/unshape) - uses dew for procedural generation parameters
- [moonlet](/moonlet) - hosts dew's Lua backend
