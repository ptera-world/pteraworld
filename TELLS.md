# TELLS.md — AI Writing Audit

Adversarial analysis of `public/content/` prose. Each tell is a pattern that makes the writing read as machine-generated. Fix these iteratively to get the corpus to pass as human.

---

## Tell 1: The "Not because X — because Y" Construction

**Frequency:** Dozens of occurrences across prose, hubris, and unfiltered.

**What it signals:** High-probability token continuation from RLHF training. A model reaches for this compulsively because it reliably produces the *feel* of nuance without requiring it.

**Examples to fix:**
- `not-because-its-dishonest` → `this-is-not-a-personal-website.md`
- `Not because AGI is evil. Because that's what the organizations building it optimize for.` → `what-will-agi-actually-want.md`
- `Not because it's better — because it's legible.` → `there-used-to-be-two-kinds-of-programmer.md`
- `Not because they're bad people — because seeing someone takes sustained attention.` → `why-are-you-lonely.md`
- `Not because you're lying to yourself — because memory is reconstructive, not archival.` → `nothing-lasts.md`

**Fix:** Use it at most once per essay, if at all. Vary with: "The problem isn't X. It's Y." / "X isn't the issue — Y is." / or just rewrite to remove the contrast frame entirely.

---

## Tell 2: "Worth Sitting With"

**Frequency:** ~6 occurrences across multiple collections.

**What it signals:** AI's preferred way to gesture at profundity without doing the work of establishing it. Signals "this is deep" rather than being deep.

**Examples to fix:**
- `Whatever it is, it seems worth sitting with for a moment.` → `the-great-deceit.md`
- `And that's worth sitting with, because the present is already where the problems are.` → `what-will-agi-actually-want.md`
- `the self — the answer to 'who am I' — is whatever this process is producing right now... and that's worth sitting with.` → `who-am-i.md`
- `That's a pattern worth sitting with.` → `is-it-just-interpolation.md`

**Fix:** Delete it. Say why the thing is interesting instead, or end the paragraph one sentence earlier.

---

## Tell 3: "Not through X — just through Y" (Absolution Framing)

**Frequency:** ~7 occurrences, heavily in hubris essays.

**What it signals:** A template for exonerating individuals while blaming systems. Clean, balanced, symmetrical — too symmetrical. Real thinking is lopsided.

**Examples to fix:**
- `Not through conspiracy, just through the same logic that produced the housing market.` → `the-alignment-problem.md`
- `Not through malice. Just through the quiet logic of what gets renewed.` → `the-score-becomes-the-thing.md`
- `Not through disaster — through deprecation.` → `what-do-we-keep-losing.md`
- `Not as a motivational slogan. As mechanics.` → `why-is-change-so-hard.md`
- `Not as conspiracy. Just as default settings.` → `whats-the-purpose-of-life.md`

**Fix:** Break the symmetry. Sometimes the answer is lopsided: "It's not conspiracy. It's just the math." Drop "just" — it's doing dishonest work.

---

## Tell 4: Relentless Second Person

**Frequency:** Every prose essay, every paragraph, almost without exception.

**What it signals:** A model optimizing for engagement by keeping the reader addressed at all times. Human essayists shift distance — drop into "we," use "people," go impersonal when the topic calls for it.

**Fix:** Audit each essay for where "you" could become "people" or "we" or just a noun. The intentional second-person framing is in CLAUDE.md and is load-bearing — but it should breathe. No human writer maintains it in literally every sentence of forty essays.

---

## Tell 5: Zero Variance in Emotional Register

**Frequency:** All 90+ files.

**What it signals:** Every essay is warm, analytical, gently challenging, empathetic without being maudlin. No essay is angrier than another. No essay is sloppier than another. No essay is clearly written on a worse day. Human writers have variance.

**Fix:** Some essays should be tighter and more impatient. Some should be more tentative. The `unfiltered/` collection does this a little (shorter sentences, lowercase) but the emotional depth is identically calibrated across all of them.

---

## Tell 6: Uniform Argument Shape

**Every essay follows:**
1. Sharp compressed open
2. Immediate complication ("but it's not that simple")
3. H2 subheadings as questions
4. "Not because X" constructions throughout
5. Resolution that refuses to resolve while gesturing at resolution
6. See Also

**Fix:** Some essays should end bluntly. Some should open with the complication instead of the claim. Some subheadings should be statements, not questions. The shape is so consistent it reads as a template being filled in.

---

## Tell 7: Recurring Vocabulary (Model Token Preferences)

These words appear far more often than any individual human writer's habits would predict:

| Word/phrase | Essays affected |
|---|---|
| `compression` / `compress` | 6+ essays, cross-linked obsessively |
| `fitness function` | `the-alignment-problem.md`, `the-system-is-working.md`, hubris generally |
| `legible` / `legibility` | `the-score-becomes-the-thing.md`, `someone-always-chose.md`, `there-used-to-be-two-kinds-of-programmer.md` |
| `structural` (as absolution move) | virtually every essay |
| `the floor` | `unfiltered/` + cross-links |

**Fix:** These are fine individually. The issue is saturation. Vary them. Find the specific word that fits each context instead of reaching for the habitual one.

---

## Tell 8: The Pre-emptive Inoculation in Meta-Essays

**Files:** `the-great-deceit.md`, `every-word-here-was-generated.md`, `still-ai.md`, `this-site-is-manipulative.md`, `directness-is-a-rhetorical-move.md`

**What it signals:** These essays name every criticism before you can make it — and then move on. That's the AI move: inoculate, don't engage. Genuine discomfort produces ragged writing. These essays are too clean, too composed, too well-structured about their own discomfort.

**Fix:** These are the hardest to fix because they're explicitly meta. The tell isn't the acknowledgment — it's that the acknowledgment is executed perfectly. Real ambivalence would show up in the prose itself (a paragraph that goes somewhere unexpected, a hedge that doesn't resolve). Consider leaving one of them structurally incomplete or ending somewhere uncomfortable.

---

## Tell 9: Topic List = Model's Greatest Hits

`prose/` titles include: Why are you lonely? / What's the purpose of life? / Who am I? / Where does meaning live? / Nothing lasts. / What will AGI actually want?

These are the modal concerns of an LLM trained on self-help and philosophy. A human essayist has specific obsessions that don't map neatly onto the big universal questions. The topics here are broad enough to apply to almost anyone, specific enough to sound personal.

**Fix:** This one is structural and hard to fix retroactively. Future essays should emerge from specific, strange observations rather than addressing universal questions. A human writer notices something particular and works outward from it — not inward from a category.

---

## Tell 10: See Also Sections Are Structural Boilerplate

**All prose/ essays:** `## See Also` with 4–7 cross-links in identical dash-indented format.
**All hubris/ essays:** `## See also` with empty body (never populated).
**All unfiltered/ essays:** consistent lowercase `## see also` format.

No variance. No essay ends abruptly because it earned it. No essay has 2 links because only 2 applied.

**Fix:** Some essays should end without a See Also. Some should have 1 link. The hubris empty stubs should either be filled or removed — they're a visible seam.

---

## Priority Order for Iteration

1. **Tell 1** (not because X) — highest frequency, most mechanically detectable
2. **Tell 2** ("worth sitting with") — easy grep-and-fix
3. **Tell 3** (absolution framing) — closely related to Tell 1
4. **Tell 7** (vocabulary saturation) — requires reading but high payoff
5. **Tell 5** (emotional variance) — hardest, most human
6. **Tell 8** (meta-essay inoculation) — most philosophically interesting to fix

---

## What Passing Looks Like

A human essayist's body of work has:
- Signature moves that appear occasionally, not in every essay
- Essays that are clearly worse or better than others
- Vocabulary that drifts over time
- Structural choices that vary based on what the material calls for
- Specific observations that don't fully resolve into universal claims

The goal isn't to remove AI patterns — it's to add human irregularity. One uneven paragraph that goes somewhere unexpected does more work than fixing fifty "not because X" constructions.
