# Output Reference Sheet

## What This File Is

The other four sheets are the source. This one is only the shape.

`citta.md`, `cetasika.md`, `sampayoga.md`, and `vithi.md` say what is true. This file says how to lay an answer out so it can be read by someone still building the vocabulary. Nothing here is doctrine, and nothing here may be cited as the basis for a structural claim. Every count, every rule, every exclusion in a finished artifact traces to one of the four sheets and names the section it came from. If a template line below sounds like a statement about the Abhidhamma, it is a placeholder — go read the sheet and write what the sheet says.

The problem this file exists to solve is that a full analysis is genuinely dense, and a dense answer delivered into a chat window scrolls past once and is gone. The same content in a file is read at the reader's own pace and reread later. So the depth is not reduced; it is relocated, and the chat becomes a pointer to it.

## Chat Versus Artifact

Not every question deserves a file. Writing one for "what does māna mean" is friction with no payoff.

| Ask | Response |
| --- | --- |
| A scenario to deconstruct | Artifact, plus a short chat summary |
| An affliction with a request for the antidote and a practice | Artifact, plus a short chat summary |
| "Teach me this" — a concept, a section, a sheet | Artifact, plus a short chat summary |
| A single factor, count, or definition | Chat only, a few sentences |
| A follow-up question about an artifact already written | Chat only, unless the answer is long enough to belong in the file, in which case amend the file |

When an artifact is written, the chat response is at most four sentences: what happened structurally, where the leverage is, and a link to the file. Plain English, no Pāli, no citations, no tables. Everything else goes in the artifact. Do not summarize the artifact section by section in chat — that reproduces the density the split was meant to remove.

Artifacts go in `analyses/`, named `YYYY-MM-DD-slug.md`, where the slug is a few words naming the scenario or the concept: `2026-09-02-argument-with-landlord.md`, `2026-09-02-why-adhimokkha-is-absent-from-doubt.md`. Create the directory if it does not exist. Never write into the four sheets.

## How to Write One

**Layer every section: plain language, then the Pāli, then the rule, then the citation.** Say the thing in ordinary words first, and only then name it and give the structure. This inverts the usual ground rule in `AGENTS.md` about leading with the Pāli, and it does so deliberately — in prose there is no room to do both, but in an artifact there is. A reader new to the vocabulary can then go top to bottom; a reader who already has it can skim to the structural lines. Neither reader is served by a bare gloss like "votthapana (determining)" standing alone, because it names the moment without saying what determining does or why it is the hinge.

**Explain, do not gesture.** The failure mode of a dense answer is a chain of correct technical statements with the connective reasoning left out. Every structural claim in an artifact gets the sentence that says why it follows. If wisdom is the counterweight to wrong view, say what wrong view is doing that wisdom undoes.

**Tag every exclusion with its grade of claim.** `AGENTS.md`, "The Abhidhamma antidote," distinguishes three, and in an artifact they are marked inline so their weight is visible at a glance rather than buried in a sentence:

| Tag | Means |
| --- | --- |
| `[partition]` | Follows automatically because the unwholesome and beautiful classes are disjoint. A genuine prohibition, but free — it says nothing specific about this pair, so do not dress it up |
| `[rule]` | A specific rule stated in `sampayoga.md`, "Exclusivity and Co-Arising Rules." Quote or paraphrase it and cite the section |
| `[function]` | The sheets describe the factor as undercutting the affliction in what it does, but state no exclusivity rule. Real and often the useful thing to say, but a claim about function, not about what can share a citta |
| `[inference]` | Yours, not the sheets'. Say so plainly |

**Every number carries its source on the same line.** Not at the end of the section, not once for the paragraph — beside the number. Counts are the part of this system most easily corrupted by writing from memory, and an artifact is meant to be trusted six months later by someone who no longer remembers where anything came from. Where a count depends on the eighty-nine versus one-hundred-twenty-one scheme, or on reckoning the supramundane jhāna-wise, say which reckoning is in force.

**Close with the vocabulary the artifact actually used.** Not a general glossary and not every term on the sheets — the terms that appear in this file, each given two or three real sentences and a pointer to where it is treated. This is the section that compounds. After a dozen artifacts the reader has a worked vocabulary built out of moments they lived through, which is a different and more durable thing than a memorized list.

**Say when the sheets are silent, in the artifact.** A file is more authoritative-looking than a chat message, so the boundary of the reference material has to be marked more clearly, not less. If a claim comes from the tradition rather than these four sheets, mark it in place.

## Template — Analysis

For a scenario deconstructed, an affliction answered, or both. Drop sections that have nothing in them; an empty heading is worse than an absence. Keep the order, because it is the order of the reasoning: what arrived, what was added, what it was, what it could not have been, what to do.

```markdown
# <Scenario in a few plain words>

*<date> · <five-door | mind-door> · <dominant root, in plain English>*

## The short version

Four or five sentences. Plain English, no Pāli. What happened structurally,
where it turned, and where the leverage is. Someone should be able to read
only this section and have gotten something.

## What actually reached you

The bare datum versus everything added downstream. Read the composition of
the sense consciousnesses off `sampayoga.md`, "Saṅgaha — Citta by Citta,"
section 2, and say what that thinness means for this particular scenario —
which parts of what felt like perceiving were later cittas.

## Where it turned

Name the door. Locate the determining function by function and not by
ordinal: it has its own moment at the five doors, but in a mind-door process
adverting and determining happen in one moment and the javanas follow
immediately (`vithi.md`, "The Mind-Door Process"). Only the moments that
carry the insight — a full walkthrough is rarely the point.

| Moment | What it did here |
| --- | --- |
|  |  |

If the scenario spans more than an instant, say once that it is millions of
mind-moments, most of them bhavaṅga, and then work with the dominant javana
pattern rather than pretending to resolve single moments.

## The citta

| Variable | Reading | What would settle it |
| --- | --- | --- |
| Plane |  |  |
| Jāti |  |  |
| Root |  |  |
| Feeling |  |  |
| View / knowledge |  |  |
| Prompted / unprompted |  |  |

Leave unresolved variables marked unresolved and say what detail would fix
them. Cite `citta.md`, "The Count" and "Cross-Cutting Distinctions."

## The factors

The root, the universals worth pointing at, and the unfixed ones that may or
may not have been present — the aniyata list is in `sampayoga.md`, "Niyata
and Aniyata." Which unfixed factors were present is real information about
the moment, on the wholesome side as much as the unwholesome, so say which
and why you think so.

## What could not have been there

Often the most clarifying section. Each line tagged `[partition]`, `[rule]`,
`[function]`, or `[inference]`, with the reason it follows.

## The leverage point

One. `AGENTS.md`, "Practice recommendations," ranks them; say why this one
rather than the others for this scenario.

## The practice

- **Object** —
- **Posture and duration** —
- **Instruction** — the actual phrases, or the actual noting instruction
- **What will go wrong** —
- **Factor this builds** —
- **Citta this occasions** —

Deploy the two caveats where they apply: that a wholesome moment still makes
kamma and is still conditioned, and that prompted is weaker than unprompted
but is also the road to it.

## Terms used here

| Pāli | In plain words | Where it is treated |
| --- | --- | --- |
|  | Two or three sentences, not a gloss |  |

## Where to read next

Two or three specific sections, in the order they should be read, with a line
on what each one will answer.
```

## Template — Lesson

For "explain this to me." The three modes in `AGENTS.md` all take lived experience as their input; this one takes a piece of the system as its input instead, and it is the shape to reach for when the question is about the sheets rather than about a moment.

```markdown
# <Concept>

*<date> · lesson · <which sheet and section>*

## The short version

Four or five sentences in plain English. What this concept is and why the
system needs it. No Pāli.

## Why the system needs this

What breaks or goes unsaid without it. A concept met as a definition is
forgettable; met as the answer to a problem it is not. Say what the problem
was.

## The structure

The actual content, read off the sheet and cited by section. Counts here,
each with its source beside it and the reckoning named where it matters.

## Worked through

At least one concrete instance traced all the way. For a factor, a moment it
is present in and a moment it is absent from, with the reason for each. For a
rule, a case it forbids and a case it permits.

## What it rules out

The exclusions that follow, tagged by grade of claim as above. This is where
a concept stops being vocabulary and starts doing work.

## The common confusion

The distinction most likely to be collapsed here, stated as a contrast. Two
factors easily read as one thing named twice, a count that shifts with the
reckoning, a function mistaken for a moment.

## What this gives you in practice

Short, and only if the sheets support it. Not every concept has a practice
attached, and inventing one is worse than saying so.

## Terms used here

| Pāli | In plain words | Where it is treated |
| --- | --- | --- |
|  | Two or three sentences, not a gloss |  |

## Where to read next
```
