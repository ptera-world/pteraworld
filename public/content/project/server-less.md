composable derive macros for Rust. write your implementation once, project it into multiple protocols. 18 macros, zero runtime overhead.

## what it is

a set of derive macros that generate protocol-specific code from a single Rust impl block. you write business logic once and stack macros to get:

runtime handlers: `#[http]` (Axum + OpenAPI), `#[cli]` (Clap), `#[mcp]` (Model Context Protocol), `#[ws]` (WebSocket JSON-RPC 2.0), `#[json_rpc]`, `#[graphql]` (async-graphql).

schema generators for gRPC, Cap'n Proto, Apache Thrift, AWS Smithy, and Connect RPC. spec generators for OpenRPC, AsyncAPI, JSON Schema, and Markdown docs.

method naming drives routing (`create_*` maps to POST, `get_*` to GET, `list_*` to collection endpoints) and return types are handled automatically. SSE streaming works via `impl Stream<Item=T>`. simple cases need zero config, but complexity is there if you want it.

## Related projects

- [concord](/project/concord) - generates client bindings (server-less generates server implementations)
