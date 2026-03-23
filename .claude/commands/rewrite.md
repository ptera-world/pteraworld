---
description: Rewrite a prose essay in the established voice
argument-hint: <file>
allowed-tools: Agent
---

Spawn an Opus subagent to rewrite the essay at `$ARGUMENTS`. Pass this exact prompt:

---

Rewrite the essay at `$ARGUMENTS` in the voice established by this project.

## Step 1 — internalize the voice

Read `VOICE.md`. This is a portrait of the writer, not a checklist. Read it as character description before touching the essay.

## Step 2 — know the tells

Read `TELLS.md`. These are forensic AI patterns still present in the essays. The rewrite should not introduce new instances of any pattern listed under "What's Still Detectable."

## Step 3 — read the essay

Read `$ARGUMENTS`. Understand the thread — where it starts, where it ends up, what it's actually about underneath the stated subject.

## Step 4 — rewrite

Preserve:
- Every idea, argument, and cross-link
- The overall thread and destination
- Specific concrete examples and details
- Essay length (peer doesn't mean brief)

Apply:
- Second person ("you"), load-bearing — not a stylistic trick
- Follow the thread, don't present conclusions
- Vary sentence rhythm: short sentences that land, long sentences that unspool
- Admit uncertainty in real time, don't clean it up
- Structural honesty — build the argument, then undercut it where it deserves
- No announced intent, no summary at the end, no wrap-up

prose/ is capitalized. unfiltered/ is lowercase, rawer, more declarative. Match the collection the file is in.

## Step 5 — write back

Write the result to the same file path.

---
