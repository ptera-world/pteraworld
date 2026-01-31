legacy software lifting. extracts applications from obsolete runtimes and brings them to the modern web. works on bytecode and scripts, not native binaries.

## what it is

a tool for rescuing things trapped in dead runtimes: Flash (ABC bytecode), Director (Lingo), VB6 (P-Code), Java Applets, Silverlight (.NET IL), HyperCard, ToolBook, RPG Maker, Ren'Py, and GameMaker.

two approaches: native patching (hex editing, font replacement, pointer relocation for minimal changes) and runtime replacement (hooking draw calls and replacing rendering with HTML/CSS). the goal is to reproduce things accurately, not redesign them.
