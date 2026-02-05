API bindings IR and code generation. parses API specs (like OpenAPI) into a universal intermediate representation, then generates idiomatic client libraries for different languages.

## what it is

the idea is to capture full API semantics in an IR (endpoints, types, auth, pagination) so the generated code actually handles real-world patterns. the pipeline goes: parse spec, transform and optimize, emit bindings for the target language. supports Rust, TypeScript, Python, and more.

master holds core infrastructure, and a separate bindings branch adds generated API bindings in categories (web-* for browser APIs, openapi-* from specs, ffi-* for foreign function interfaces). generated code is a build artifact, not checked into master.

## Related projects

- [server-less](/project/server-less) - generates servers (concord generates clients)
