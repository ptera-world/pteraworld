# Forensic Linguistic Analysis: AI Authorship Evidence in pteraworld Content

## Audit History

- **Audit 1** (initial): identified tells 1-8 across 78 essays
- **Audit 2** (post-fix): mechanical fixes applied to tells 1-4, 7. 4 essays fully rewritten, 4 lighter revisions for subtle tells. Pre-commit hook added for bold-label pattern.
- **Audit 3** (current): fresh adversarial pass across 76 essays. Measures what survived the fixes and identifies new tells.

## Current State — What's Fixed

| Tell | Audit 1 | Audit 3 | Status |
|------|---------|---------|--------|
| 1a. "Not X. Not Y. Z." chains | 10+ essays | ~4 inline | Effectively eliminated |
| 1b. "Not because X. Because Y." | 38 | 32 | Still persistent |
| 1c. "This isn't about X" | 4+ essays | 0 | **Eliminated** |
| 2b. Question H2 headers | 47.6% | 23.3% | Halved |
| 2c. "See also" sections | 82% | 26.3% | **Major improvement** |
| 3a. "genuinely" | 16 | 0 | **Eliminated** |
| 3b. "actually" | 227 | 124 | Halved, still 1.6/essay |
| 3c. "the real" | 25 | 17 | Down 32% |
| 3d. "probably" | 43 | 14 | Down 67% |
| 4a. Concession devices | high | ~11 total | Low density |
| 7. Bold-label lists | 79 instances | 0 | **Eliminated** (pre-commit hook) |

---

## What's Still Detectable

### 1. SECTION COUNT UNIFORMITY — the #1 remaining structural tell

89.5% of essays have 5-8 H2 sections (up from 83% in audit 1 — the fixes made this *worse* by normalizing structure). Distribution:

- 3 sections: 1 essay
- 4 sections: 5 essays
- 5 sections: 25 essays ← mode
- 6 sections: 20 essays
- 7 sections: 15 essays
- 8 sections: 8 essays
- 9 sections: 1 essay
- 14 sections: 1 essay

68 of 76 essays (89.5%) fall in the 5-8 range. Only 2 essays are outside 4-8. A human corpus would have 2-section pieces, 12-section pieces, pieces with no sections at all. This tight clustering around 5-6 sections is the most measurable structural fingerprint in the corpus and the easiest for an adversarial classifier to target.

### 2. "NOT BECAUSE X, BECAUSE Y" — persistent syntactic tic

32 instances remain. Appears in roughly half of all unfiltered essays. Still the corpus's most distinctive sentence-level template. One construction appearing every 2.4 essays is too frequent to be stylistic choice.

### 3. "ACTUALLY" — still overused

124 occurrences across 76 essays (1.6/essay). Worst offenders: `can-you-tell-when-its-wrong.md` (7), `why-are-you-lonely.md` (6), `what-if-your-brain-isnt-broken.md` (6). Still functions as the model's primary tool for simulating corrective insight.

### 4. WORD COUNT UNIFORMITY

| Collection | Mean | Std Dev | Min | Max | Within 1 SD |
|------------|------|---------|-----|-----|-------------|
| Prose | 996 | 287 | 483 | 2166 | 69.4% |
| Unfiltered | 1099 | 273 | 756 | 1971 | 81.5% |

Prose is near the expected 68% for a normal distribution. Unfiltered is suspiciously tight — 81.5% within 1 SD, minimum 756 words, no short-form essays. Every unfiltered essay feels written to the same length spec.

### 5. THE SUBTLE TELLS (5a-5g) — largely unfixed

4 essays were rewritten; ~60 remain untouched. Scoring on 0-3 scale across a 14-essay sample:

| Tell | Rewritten (n=4) | Non-rewritten (n=10) | Delta |
|------|-----------------|---------------------|-------|
| 5a. Paragraph rhythm | 1.00 | 1.80 | -0.80 |
| 5b. Metaphor construction | 0.75 | 1.50 | -0.75 |
| 5c. Composed uncertainty | 0.50 | 1.20 | -0.70 |
| 5d. Evidence types | 1.00 | 1.50 | -0.50 |
| 5e. Emotional register | 1.00 | 1.30 | -0.30 |
| 5f. Transition mechanics | 1.00 | 1.50 | -0.50 |
| 5g. Absence of disfluency | **0.50** | **2.00** | **-1.50** |
| **Overall** | **0.82** | **1.54** | **-0.72** |

The rewrites work. The biggest improvement is in disfluency — rewritten essays have genuine compositional mess (abandoned metaphors, mid-sentence pivots, asides that don't serve the argument). Non-rewritten essays remain polished to a fault.

Notable non-rewritten outliers that already score well: `just.md` (1.00), `the-system-filled-every-gap-you-had.md` (0.86). These may not need full rewrites.

**Evidence types (5d) are the most persistent tell across both groups.** No essay — rewritten or not — uses personal anecdotes with specific detail, empirical data, named quotes, or historical dates. Everything is structural analogy + second-person hypothetical. Likely unfixable without human-injected material.

### 6. CROSS-COLLECTION VOICE IDENTITY — unchanged

Tell 6b ("the model is wearing three different hats but thinking in the same way") survives all fixes. Detailed cross-collection comparison reveals:

**Identical sentence rhythm architecture.** Both collections use short-short-long cadence. Example:
- Prose: "Art is intent." / "You meant it." / "You chose this over that, not because function demanded it, but because you wanted it this way."
- Unfiltered: "money is the universal prerequisite." / then longer elaboration with the same rhythm.

**Same paragraph template.** Thesis → elaboration → reframe-at-the-end. Both collections build paragraphs this way.

**Same rhetorical moves.** "X isn't Y, it's Z" reframe; anticipate-and-dismiss; circular-system-as-argument; list-of-mechanisms-then-evaluate. All appear across both collections.

**Anger is costumed, not genuine.** The unfiltered essays apply architecturally precise, parallel-structure prose technique to angry subject matter. "charity replaces rights. care becomes content. dignity becomes narrative. need becomes performance. survival becomes virality." — five-part parallel construction. That is not rawness. That is maximally composed. Compare to prose's version of intensity: "You never get judged. You never fail publicly. You never get exposed. You also never make anything." Same technique, same machinery.

**The "system reveals itself" move is universal.** Every essay makes the same core move: the stated purpose of X masks the actual function of X. Perfectionism masks fear. School masks compliance training. Art masks intent. This is one idea applied to different topics.

The two collections are the same writer wearing different hats. The hats are: capitalization, subject matter, and emotional register. The thinking, the structure, and the rhetorical machinery are indistinguishable.

---

## New Tells (Audit 3)

### 9. CROSS-LINK DENSITY AS STRUCTURAL CRUTCH

Essays link to other essays instead of developing ideas in-place. Some essays have 20+ cross-links in 90 lines. The links perform the appearance of interconnected thought, but they do structural work the prose should do: instead of explaining what a label is, the essay links to "what-are-labels-anyway." A human essayist writing interconnected pieces might cross-link occasionally; this corpus cross-links constantly. Mechanically detectable: count internal links per essay.

### 10. THE EXPLANATORY PARENTHETICAL

Nearly every paragraph contains a claim followed by a dash-parenthetical that re-explains it. "not nothing as in 'no energy for a hobby.' nothing as in the person behind the routine stopped being accessible hours ago." The model hedges — it makes a claim, then immediately explains what it meant, as if it doesn't trust the claim to land. Human writers do this occasionally. The corpus does it in nearly every paragraph.

### 11. THE SECOND-PERSON CONFRONTATION CLOSE

Essays consistently end with a direct "you" challenge that performs having changed the reader:
- "Whether you actually will is a different question" (lonely)
- "Including what this sentence means to you by the time you've finished reading it" (everything-changes)
- "Probably depends on who's asking. And what they need the answer to protect them from" (interpolation)

The endings are more structurally uniform than the openings. This is a signature RLHF move for essay closings.

---

## Priority Ranking for Fixes

1. **Section count variance** — some essays need 2-3 sections, some 10+. Easiest structural tell to measure, hardest to explain away.
2. **Prose rewrites for subtle tells** — prose non-rewritten avg 1.86, unfiltered avg 1.17. Prose needs it more.
3. **"actually" cleanup** — 124 remaining, some essays use it 6-7 times.
4. **"not because X, because Y"** — 32 remaining, appears in ~half of unfiltered essays.
5. **Cross-collection voice differentiation** — the collections need to *think* differently, not just capitalize differently.
6. **Evidence types** — requires human intervention to inject real personal detail.

## Conclusion

The mechanical fixes landed well: bold-label lists eliminated, "genuinely" gone, "See also" uniformity broken, question headers halved, syntactic templates mostly cleared. The corpus is measurably less detectable on these axes.

But the deeper tells persist. The essays still think the same way across collections, still avoid evidence that requires having lived a specific life, still produce paragraphs with the same internal cadence, still handle uncertainty as a composed rhetorical position rather than a genuine state. The 60 non-rewritten essays average 1.54 on the subtle-tell scale (out of 3), while the 4 rewritten essays average 0.82 — proving the rewrites work, but also proving the scale of remaining work.

The single most actionable finding: section count uniformity is now the dominant structural fingerprint (89.5% in the 5-8 range), and it got worse with the fixes. An adversarial classifier would key on this first.
