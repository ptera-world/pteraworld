---
label: "how do i know this code is good?"
description: "you don't read every line.\nneither does anyone else."
tags: [technology]
---

# How do I know this code is good?

You have 250,000 lines of Rust you didn't type by hand. You didn't read every line. You [can't prove it's not a bitcoin miner](/prose/am-i-just-pretending). So how do you know it's good?

The same way everyone else knows. You just don't realize it.

## Nobody reads every line

Let's start here. The fantasy of the programmer who reads and understands every line of their codebase is exactly that — a fantasy. It stops being possible around 10,000 lines. By 100,000 it's absurd. The Linux kernel is 30 million lines. Nobody understands all of it. Not even Torvalds.

What people actually do is build layers of trust. You trust the compiler. You trust the type system. You trust the test suite. You trust the linter. You trust the code review. You trust the abstraction boundaries. Each layer catches different things. Together, they're enough.

AI-generated code doesn't change this. It adds a question — "do I trust the author?" — but that question already existed for every dependency you import, every Stack Overflow snippet you paste, every coworker's PR you approve.

## What actually catches bugs

Here's what catches bugs, in rough order of [how much you should rely on them](#the-stack):

**The type system** catches the most. If the code compiles in Rust, an enormous category of bugs is already eliminated. Memory safety, null references, data races, type mismatches. This isn't trust. It's proof. The compiler doesn't care who wrote the code.

**Tests** catch the next layer. Does it do what it's supposed to? If you wrote the tests — even if the LLM wrote the implementation — you defined the contract. The implementation either honors it or it doesn't.

**Lints** (clippy, in Rust) catch idiom violations, common mistakes, performance issues, and suspicious patterns. They're mechanical reviewers that never get tired and never wave things through because it's Friday.

**Structure** catches architectural problems. Is the code modular? Are the abstractions [at the right level](/prose/the-right-tool-for-the-job)? Do the module boundaries make sense? You don't need to read every line to see structure. You need to read signatures, trait definitions, module hierarchies. The shape of the code is visible without reading the body.

**Review by use** catches everything else. You use the tool. It works or it doesn't. It handles your edge cases or it doesn't. Over time, trust accumulates not from reading but from [running](#trust-accumulates).

## The stack

Here's the real difference between "vibe coded garbage" and "AI-assisted software that works":

**Garbage:** write prompt → get code → ship it. No types (or weak types). No tests. No lints. No review. You're hoping it works. It probably doesn't.

**What actually works:** design the architecture → write (or dictate) the types and traits → let the LLM fill in implementations → compiler rejects the broken ones → tests verify the contracts → lints catch the smells → you review the structure → you use it and it either survives or you fix it.

Every step in the second version is a filter. The LLM generates code that passes through the compiler, through the test suite, through the linter, through your structural review, through actual usage. What survives that gauntlet is... good code. Not because the LLM is perfect, but because imperfection gets caught.

This is exactly the same gauntlet that human-written code passes through. The only difference is who typed it.

## Trust accumulates

You don't trust code because you read it. You trust code because it [survived](#what-actually-catches-bugs).

The first time you run your decompiler on a real game and it produces correct output, that's trust. Not in every line — in the *system*. The tenth time it works, more trust. The time it fails and you fix it and it works again, even more. Trust is empirical.

After a thousand test cases, after months of daily use, after dozens of bug fixes, you know the code is good the same way you know your car works. Not because you inspected every bolt. Because you drove it to work every day and it got you there.

## What's actually different

One thing is genuinely different about AI-generated code: the [speed](/prose/am-i-just-pretending#speed-is-suspicious) makes it tempting to skip the filters. When you can produce code in minutes instead of hours, the pressure to test, lint, review, and think drops. "It compiles, ship it."

That's the real risk. Not that AI writes bad code — it writes mediocre code with occasional brilliance and occasional bugs, just like humans. The risk is that speed erodes discipline. That you stop writing tests because the implementation came so fast. That you stop thinking about architecture because you can always regenerate.

The defense is the same defense it's always been: make the filters automatic. Pre-commit hooks that run fmt and clippy. CI that runs the test suite. Type systems that reject invalid states. The human failing has always been "I'll skip the checks just this once." AI-assisted coding just makes "just this once" happen more often.

## The question you're actually asking

"How do I know this code is good?" is really asking "how do I know *I'm* good?" Because the code's quality is verifiable. Compile it. Test it. Lint it. Run it. Those have answers.

The harder question is whether steering an LLM is a [real skill](/prose/am-i-just-pretending#taste-is-the-bottleneck), whether the architecture you designed is actually good or just happens to compile, whether your taste is refined or you're [fooling yourself](/prose/why-is-perfectionism-a-trap).

For that, there's only one test: does the thing work when it meets reality? Not in a test suite. In someone's hands. On a real game binary. On a real document. On a real codebase.

If it does, the code is good. Regardless of who typed it.
