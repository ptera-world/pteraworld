---
label: "am i just pretending?"
description: "a quarter million lines of code.\nco-authored by a machine."
tags: [identity, technology]
---

# Am I just pretending?

Here's the situation. You have a quarter million lines of working software. A decompiler, a code analyzer, a document converter, a file format parser, an expression language. They work. They pass tests. They handle edge cases you didn't even know existed.

You didn't write every line. You wrote maybe... some of them? You steered. You designed. You argued about architecture. You rejected bad ideas. You knew what "right" felt like even when you couldn't produce it from scratch. And then an AI wrote the implementation while you held the reins.

Is that real?

## The anxiety has layers

Layer one: **"I didn't write this."** But you did design it. You chose the decomposition, the boundaries, the structure. You rejected seventeen wrong approaches before the right one landed. The output reflects your taste even if your fingers didn't type it.

Layer two: **"How do I know it works?"** You don't read every line. Nobody reads every line of a codebase that size, even one they wrote entirely by hand. You rely on automated checks — the compiler, the tests, the linter, the type system. Those are the same guarantees everyone else uses. You just got there [faster](#speed-is-suspicious).

Layer three: **"How do I tell anyone?"** This is the real one. "I used an AI to build all of this, I swear it works." You sound like a lunatic. People see the co-author tag and immediately disengage. The work is invisible behind the method.

## Speed is suspicious

If someone told you they wrote a quarter million lines of production code in ten weeks, you'd assume it was garbage. That's the heuristic. Volume at speed means low quality. It's usually correct.

But the heuristic assumes a single bottleneck: one person typing. When the bottleneck moves — when the constraint becomes [taste and direction](#taste-is-the-bottleneck) rather than keystroke throughput — the volume ceiling changes. The heuristic breaks. And there's no socially legible way to explain that it broke.

So you either undersell the work ("oh it's just some side projects") or oversell the method ("AI is transforming everything!") and both are wrong. The truth — "I'm a moderately experienced programmer who uses an AI to execute at 10x speed while I focus on architecture and design" — sounds either arrogant or delusional depending on the audience.

## Taste is the bottleneck

The output isn't good because an AI wrote it. The output is good because you [rejected the bad versions](/prose/what-can-i-change). Every session is a negotiation. The AI proposes, you evaluate, you redirect. The skill isn't production. It's knowing what you want.

That's always been the skill. In any medium. Writing has never been about typing. Cooking has never been about chopping. Design has never been about pushing pixels. The mechanical act was just the only available interface.

But "knowing what to build" doesn't look like work. It looks like sitting there while a machine does the job. It looks like cheating. It looks like pretending.

## The craft question

Is directing an AI a craft? Is it [art](/prose/what-is-art)?

If art is intent — choosing this over that because you wanted it this way — then yes. Every architectural decision, every rejected proposal, every "no, that's fundamentally wrong" is a choice. The medium is conversation instead of keystrokes, but the intent is identical.

But it doesn't *feel* like craft. Craft has resistance. You push against the material and the material pushes back and the struggle produces something that bears your fingerprints. Directing an AI is frictionless in the wrong way. You say what you want and you get it, approximately. Where's the struggle? Where are the fingerprints?

They're in the *approximately*. In the gap between what you asked for and what you got. In the twenty rounds of "no, not like that" before it clicks. In the architecture that emerged from a hundred small corrections. The fingerprints are there. They're just not visible to anyone who wasn't in the room.

## So are you pretending?

No. But you can't prove it. And that's the uncomfortable part.

The work is real. The judgment is real. The taste is real. The output is real. But the legibility — the thing that lets other people see that it's real — is missing. There's no callused hands, no late nights staring at a debugger, no war stories about the grind. There's just... a lot of output and a co-author tag.

Maybe that's fine. Maybe the question isn't "am I pretending" but "does it matter who believes me." The code works regardless. The tools exist regardless. The [purpose](/prose/why-do-i-build-tools) — or lack of it — is yours to figure out regardless.

The pretending question is a distraction from the real one. Not "is this legitimate" but "[what is it for](/prose/whats-the-purpose-of-life)."
