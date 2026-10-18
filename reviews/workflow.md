# Neuroscience review workflow

This file is the job. A parent agent reads it, walks the queue, and launches one fresh sub-agent per row. The chat can be closed. Progress lives here and in the cards.

The four doctrine sheets stay as they are: `citta.md`, `cetasika.md`, `sampayoga.md`, and `vithi.md`. This workflow writes review cards, a one-line index, a rollup per sheet, and a draft concordance. Scenario answers keep using the sheets.

## What this is deciding

Each row asks what modern neuroscience can say about that section. A phenomenon, here, is something that shows up and can be pointed at: a person can notice it, and a study can try to measure something in that neighborhood. `dosa` (hatred) as a rejecting feel is a phenomenon. "Greed and hatred never co-arise" is a rule about when that phenomenon may be present. Rebirth-linking is a claim no feeling-report or scan is built to test.

"Supported" means the literature has a nearby construct. It leaves the sheet's definition, similes, and counts as traditional doctrine.

## Order

Walk the queue from top to bottom. The sheets are ordered by how close their units sit to something a study can measure.

1. `cetasika.md` — mental factors. Attention, feeling, craving, aversion, mindfulness, and compassion are the nearest constructs.
2. `vithi.md` — timing. This is where a mind-moment and a lab's timescale come apart, so the grain problem is learned before the taxonomies.
3. `sampayoga.md` — combination rules. Most exclusivity rules will come back as timescale mismatches.
4. `citta.md` — the classification. Ask whether a distinction still earns its place. A numbered citta is not a brain region, and the review does not try to find one.

Within a sheet, empty group headings are omitted. Every remaining heading is one row. There are 52 cetasika rows, 19 vithi rows, 15 sampayoga rows, and 23 citta rows.

## How a run moves

You start one parent. The parent launches every sub-agent after that. You do not start the next row yourself.

1. The parent finds the first row whose status is `pending` or `in-progress`. A row left `in-progress` was interrupted; treat it as not done.
2. The parent sets that row to `in-progress`.
3. The parent launches one new sub-agent with the prompt below, filled in for that row. The parent does not resume a finished sub-agent. Resuming would keep the old context.
4. The sub-agent reads only the named lines, writes `reviews/cards/<id>.md`, and returns one line.
5. The parent sets the row to `done`, writes the verdict label in the verdict cell, and appends the returned line to `reviews/index.tsv`. The parent creates that file with its header if it does not exist yet.
6. The parent takes the next row.

The parent does not open the four doctrine sheets and does not open the cards while walking. One sub-agent runs at a time, so the parent's context stays a list of one-line returns.

When the last row of a sheet is `done`, the parent writes `reviews/rollup-<sheet>.md` from `reviews/index.tsv` only. It may open a card whose verdict is `contested`. When all four rollups exist, the parent writes `reviews/concordance.md` from the rollups and stops.

If the platform stops the parent before the queue is empty, start the parent again. It continues at the first row that is not `done`.

## Verdicts

The sub-agent picks one label for the section:

| Label | Meaning |
| --- | --- |
| `supported` | A nearby construct has a real literature: reviews or several converging studies. |
| `different-grain` | The research is about the same neighborhood, at a coarser timescale than one mind-moment. |
| `contested` | The literature splits, or the methods are too weak to carry the claim. |
| `not-a-science-question` | The section is rebirth, path and fruition, kamma as a moral ledger, or another claim no experiment is built to test. |

A section can contain several propositions. The label names the call that matters for the wellness layer, and the verdict paragraph says what the other propositions did.

## Card

The sub-agent writes this and nothing else:

```markdown
# <id>

- Sheet:
- Lines:
- Section:

## Propositions

- (<type>) one sentence, quoted or closely paraphrased from the assigned lines

## Sources

### <citation>
- Camp:
- Measured:
- Finding: at most 80 words

## Verdict

- Label:
- At most 120 words.
```

Proposition types are `phenomenological`, `structural`, `temporal`, and `outside-the-method`. Use as many as the assigned lines support, and stop when the section is covered. A card stays under 400 words.

## Sources

- Search existing published work. This workflow does not run a survey, recruit anyone, or commission a study.
- Prefer a systematic review, a meta-analysis, or a consensus paper. At most three sources.
- Name the theoretical camp when the camp changes the verdict. Basic-emotion models and constructed-emotion models disagree on whether a factor is a natural kind, and that disagreement is itself a finding.
- A single unreplicated imaging paper cannot carry a verdict of `supported`.
- If the propositions are `outside-the-method`, skip the search and say so under Sources.
- If no direct literature turns up, write "No direct literature" under Sources and choose `different-grain`, `contested`, or `not-a-science-question`. Do not fill the gap with a nearby paper that answers a different question.
- Record the citation, what was measured, and the finding. Do not copy a paper's body into the card.

## What the parent returns to

`reviews/index.tsv` has a header and one row per finished section:

```text
id	sheet	verdict	sentence
```

The sentence is the one sentence the sub-agent returned. The rollup for a sheet reads only that sheet's lines from this index. It names the pattern: which sections are training targets with a literature, which rules are finer than the data, which claims stay traditional. It stays under 800 words.

`reviews/concordance.md` is the draft wellness layer, written after all four rollups. Beside each section it keeps the verdict label and one plain-language line. It does not rewrite a practice, a count, or a sheet. Changing how scenario answers speak waits until you accept a concordance entry.

## Parent prompt

Paste this to start. The parent then continues on its own.

```text
Read reviews/workflow.md and run its parent loop until every queue row is done, all four rollups exist, and reviews/concordance.md is written. Launch each sub-agent yourself. Do not edit citta.md, cetasika.md, sampayoga.md, or vithi.md. If you are restarted, continue at the first row that is not done.
```

## Sub-agent prompt

The parent fills the blanks and sends this. The sub-agent has no other context.

```text
Review one Abhidhamma section against modern neuroscience.

Read only lines <start>–<end> of <sheet>. Do not open any other file.

A phenomenon is something that shows up and can be pointed at, in experience and at least roughly in a study. Classify each proposition as phenomenological, structural, temporal, or outside-the-method.

Write reviews/cards/<id>.md in this shape and nothing else:

# <id>

- Sheet:
- Lines:
- Section:

## Propositions

- (<type>) one sentence, quoted or closely paraphrased from the assigned lines

## Sources

### <citation>
- Camp:
- Measured:
- Finding: at most 80 words

## Verdict

- Label: supported, different-grain, contested, or not-a-science-question
- At most 120 words.

Rules:
- At most three sources. Prefer a review, meta-analysis, or consensus paper. Name the camp. Do not copy a paper's body.
- If the propositions are outside-the-method, do not search. Say so under Sources.
- If nothing direct exists, write "No direct literature" and do not substitute a neighboring finding.
- A single unreplicated imaging paper cannot carry a verdict of supported.
- The card stays under 400 words.

Return exactly one line and nothing else:
<id> | <verdict> | <one sentence a reader could put beside this section>
```

## Queue

Status is `pending`, `in-progress`, or `done`. The verdict cell stays empty until the row is `done`.

### cetasika.md

| id | lines | section | status | verdict |
| --- | --- | --- | --- | --- |
| `cetasika-01-phassa` | 5–8 | 1. Phassa — Contact | pending | |
| `cetasika-02-vedana` | 9–12 | 2. Vedanā — Feeling | pending | |
| `cetasika-03-sanna` | 13–16 | 3. Saññā — Perception | pending | |
| `cetasika-04-cetana` | 17–20 | 4. Cetanā — Intention | pending | |
| `cetasika-05-ekaggata` | 21–24 | 5. Ekaggatā — One-pointedness | pending | |
| `cetasika-06-jivitindriya` | 25–28 | 6. Jīvitindriya — Life faculty | pending | |
| `cetasika-07-manasikara` | 29–32 | 7. Manasikāra — Attention | pending | |
| `cetasika-08-vitakka` | 35–38 | 1. Vitakka — Initial thought | pending | |
| `cetasika-09-vicara` | 39–42 | 2. Vicāra — Sustained thought | pending | |
| `cetasika-10-adhimokkha` | 43–46 | 3. Adhimokkha — Determination | pending | |
| `cetasika-11-viriya` | 47–50 | 4. Viriya — Energy | pending | |
| `cetasika-12-piti` | 51–54 | 5. Pīti — Rapture | pending | |
| `cetasika-13-chanda` | 55–58 | 6. Chanda — Wish | pending | |
| `cetasika-14-moha` | 61–64 | 1. Moha — Delusion | pending | |
| `cetasika-15-ahirika` | 65–68 | 2. Ahirika — Shamelessness | pending | |
| `cetasika-16-anottappa` | 69–72 | 3. Anottappa — Moral fearlessness | pending | |
| `cetasika-17-uddhacca` | 73–76 | 4. Uddhacca — Restlessness | pending | |
| `cetasika-18-lobha` | 77–80 | 5. Lobha — Greed | pending | |
| `cetasika-19-ditthi` | 81–84 | 6. Diṭṭhi — Wrong view | pending | |
| `cetasika-20-mana` | 85–88 | 7. Māna — Conceit | pending | |
| `cetasika-21-dosa` | 89–92 | 8. Dosa — Hatred | pending | |
| `cetasika-22-issa` | 93–96 | 9. Issā — Envy | pending | |
| `cetasika-23-macchariya` | 97–100 | 10. Macchariya — Stinginess | pending | |
| `cetasika-24-kukkucca` | 101–104 | 11. Kukkucca — Worry, remorse | pending | |
| `cetasika-25-thina` | 105–108 | 12. Thīna — Sloth, laziness | pending | |
| `cetasika-26-middha` | 109–112 | 13. Middha — Torpor, tiredness | pending | |
| `cetasika-27-vicikiccha` | 113–116 | 14. Vicikicchā — Sceptical doubt | pending | |
| `cetasika-28-saddha` | 119–122 | 1. Saddhā — Confidence | pending | |
| `cetasika-29-sati` | 123–126 | 2. Sati — Mindfulness | pending | |
| `cetasika-30-hiri` | 127–130 | 3. Hiri — Moral shame | pending | |
| `cetasika-31-ottappa` | 131–134 | 4. Ottappa — Moral fear | pending | |
| `cetasika-32-alobha` | 135–138 | 5. Alobha — Non-greed | pending | |
| `cetasika-33-adosa` | 139–142 | 6. Adosa — Non-hatred | pending | |
| `cetasika-34-tatramajjhattata` | 143–146 | 7. Tatramajjhattatā — Equanimity | pending | |
| `cetasika-35-kayapassaddhi` | 147–150 | 8. Kāyapassaddhi — Tranquillity (of mental factors) | pending | |
| `cetasika-36-cittapassaddhi` | 151–154 | 9. Cittapassaddhi — Tranquillity (of consciousness) | pending | |
| `cetasika-37-kayalahuta` | 155–158 | 10. Kāyalahutā — Lightness (of mental factors) | pending | |
| `cetasika-38-cittalahuta` | 159–162 | 11. Cittalahutā — Lightness (of consciousness) | pending | |
| `cetasika-39-kayamuduta` | 163–166 | 12. Kāyamudutā — Pliancy (of mental factors) | pending | |
| `cetasika-40-cittamuduta` | 167–170 | 13. Cittamudutā — Pliancy (of consciousness) | pending | |
| `cetasika-41-kayakammannata` | 171–174 | 14. Kāyakammaññatā — Adaptability (of mental factors) | pending | |
| `cetasika-42-cittakammannata` | 175–178 | 15. Cittakammaññatā — Adaptability (of consciousness) | pending | |
| `cetasika-43-kayapagunnata` | 179–182 | 16. Kāyapāguññatā — Proficiency (of mental factors) | pending | |
| `cetasika-44-cittapagunnata` | 183–186 | 17. Cittapāguññatā — Proficiency (of consciousness) | pending | |
| `cetasika-45-kayujjukata` | 187–190 | 18. Kāyujjukatā — Rectitude (of mental factors) | pending | |
| `cetasika-46-cittujjukata` | 191–194 | 19. Cittujjukatā — Rectitude (of consciousness) | pending | |
| `cetasika-47-samma-vaca` | 195–198 | 20. Sammā vācā — Right speech | pending | |
| `cetasika-48-samma-kammanta` | 199–202 | 21. Sammā kammanta — Right action | pending | |
| `cetasika-49-samma-ajiva` | 203–206 | 22. Sammā ājīva — Right livelihood | pending | |
| `cetasika-50-karuna` | 207–210 | 23. Karuṇā — Compassion | pending | |
| `cetasika-51-mudita` | 211–214 | 24. Muditā — Sympathetic joy | pending | |
| `cetasika-52-pannindriya` | 215–217 | 25. Paññindriya — Wisdom (faculty) | pending | |

### vithi.md

| id | lines | section | status | verdict |
| --- | --- | --- | --- | --- |
| `vithi-01-the-framework` | 3–10 | The Framework | pending | |
| `vithi-02-the-five-door-process` | 11–27 | The Five-Door Process | pending | |
| `vithi-03-atita-bhavanga` | 28–31 | 1. Atīta-bhavaṅga — Past life-continuum | pending | |
| `vithi-04-bhavanga-calana` | 32–35 | 2. Bhavaṅga-calana — Vibration | pending | |
| `vithi-05-bhavangupaccheda` | 36–39 | 3. Bhavaṅgupaccheda — Arrest | pending | |
| `vithi-06-pancadvaravajjana` | 40–43 | 4. Pañcadvārāvajjana — Five-door adverting | pending | |
| `vithi-07-panca-vinnana` | 44–47 | 5. Pañca-viññāṇa — Sense consciousness | pending | |
| `vithi-08-sampaticchana` | 48–51 | 6. Sampaṭicchana — Receiving | pending | |
| `vithi-09-santirana` | 52–55 | 7. Santīraṇa — Investigating | pending | |
| `vithi-10-votthapana` | 56–59 | 8. Votthapana — Determining | pending | |
| `vithi-11-javana` | 60–63 | 9–15. Javana — Impulsion | pending | |
| `vithi-12-tadarammana` | 64–67 | 16–17. Tadārammaṇa — Registration | pending | |
| `vithi-13-shorter-processes` | 68–80 | Shorter Processes | pending | |
| `vithi-14-the-mind-door-process` | 81–94 | The Mind-Door Process | pending | |
| `vithi-15-the-absorption-process` | 95–108 | The Absorption Process | pending | |
| `vithi-16-the-death-process` | 109–114 | The Death Process | pending | |
| `vithi-17-cuti-citta` | 115–118 | 1. Cuti citta — Death consciousness | pending | |
| `vithi-18-patisandhi-citta` | 119–122 | 2. Paṭisandhi citta — Rebirth-linking consciousness | pending | |
| `vithi-19-bhavanga` | 123–125 | 3. Bhavaṅga — Life-continuum | pending | |

### sampayoga.md

| id | lines | section | status | verdict |
| --- | --- | --- | --- | --- |
| `sampayoga-01-what-association-means` | 3–25 | What Association Means | pending | |
| `sampayoga-02-the-two-directions-of-analysis` | 26–35 | The Two Directions of Analysis | pending | |
| `sampayoga-03-sampayoga` | 36–39 | Sampayoga — Factor by Factor | pending | |
| `sampayoga-04-sabbacittasadharana` | 40–47 | 1. Sabbacittasādhāraṇa — The seven universals | pending | |
| `sampayoga-05-pakinnaka` | 48–64 | 2. Pakiṇṇaka — The six occasionals | pending | |
| `sampayoga-06-akusala` | 65–78 | 3. Akusala — The fourteen unwholesome | pending | |
| `sampayoga-07-sobhana` | 79–91 | 4. Sobhana — The twenty-five beautiful | pending | |
| `sampayoga-08-sangaha` | 92–95 | Saṅgaha — Citta by Citta | pending | |
| `sampayoga-09-akusala-citta` | 96–114 | 1. Akusala citta — Unwholesome | pending | |
| `sampayoga-10-ahetuka-citta` | 115–126 | 2. Ahetuka citta — Rootless | pending | |
| `sampayoga-11-kamavacara-sobhana-citta` | 127–145 | 3. Kāmāvacara sobhana citta — Beautiful sense-sphere | pending | |
| `sampayoga-12-mahaggata-citta` | 146–158 | 4. Mahaggata citta — Sublime | pending | |
| `sampayoga-13-lokuttara-citta` | 159–170 | 5. Lokuttara citta — Supramundane | pending | |
| `sampayoga-14-exclusivity-and-co-arising-rules` | 171–188 | Exclusivity and Co-Arising Rules | pending | |
| `sampayoga-15-niyata-and-aniyata` | 189–195 | Niyata and Aniyata | pending | |

### citta.md

| id | lines | section | status | verdict |
| --- | --- | --- | --- | --- |
| `citta-01-the-framework` | 3–16 | The Framework | pending | |
| `citta-02-the-count` | 17–28 | The Count | pending | |
| `citta-03-akusala-citta` | 29–32 | Akusala Citta — Unwholesome Consciousness | pending | |
| `citta-04-lobhamula-citta` | 33–43 | 1. Lobhamūla citta — Greed-rooted | pending | |
| `citta-05-dosamula-citta` | 44–51 | 2. Dosamūla citta — Hatred-rooted | pending | |
| `citta-06-mohamula-citta` | 52–60 | 3. Mohamūla citta — Delusion-rooted | pending | |
| `citta-07-ahetuka-citta` | 61–64 | Ahetuka Citta — Rootless Consciousness | pending | |
| `citta-08-akusala-vipaka-citta` | 65–78 | 1. Akusala-vipāka citta — Unwholesome-resultant | pending | |
| `citta-09-ahetuka-kusala-vipaka-citta` | 79–93 | 2. Ahetuka kusala-vipāka citta — Rootless wholesome-resultant | pending | |
| `citta-10-ahetuka-kiriya-citta` | 94–103 | 3. Ahetuka kiriya citta — Rootless functional | pending | |
| `citta-11-kamavacara-sobhana-citta` | 104–116 | Kāmāvacara Sobhana Citta — Beautiful Sense-Sphere Consciousness | pending | |
| `citta-12-mahakusala-citta` | 117–120 | 1. Mahākusala citta — Great wholesome | pending | |
| `citta-13-mahavipaka-citta` | 121–124 | 2. Mahāvipāka citta — Great resultant | pending | |
| `citta-14-mahakiriya-citta` | 125–128 | 3. Mahākiriya citta — Great functional | pending | |
| `citta-15-rupavacara-citta` | 129–142 | Rūpāvacara Citta — Fine-Material Consciousness | pending | |
| `citta-16-rupavacara-kusala-citta` | 143–146 | 1. Rūpāvacara kusala citta — Wholesome | pending | |
| `citta-17-rupavacara-vipaka-citta` | 147–150 | 2. Rūpāvacara vipāka citta — Resultant | pending | |
| `citta-18-rupavacara-kiriya-citta` | 151–154 | 3. Rūpāvacara kiriya citta — Functional | pending | |
| `citta-19-arupavacara-citta` | 155–167 | Arūpāvacara Citta — Immaterial Consciousness | pending | |
| `citta-20-lokuttara-citta` | 168–180 | Lokuttara Citta — Supramundane Consciousness | pending | |
| `citta-21-magga-citta` | 181–184 | 1. Magga citta — Path | pending | |
| `citta-22-phala-citta` | 185–188 | 2. Phala citta — Fruition | pending | |
| `citta-23-cross-cutting-distinctions` | 189–197 | Cross-Cutting Distinctions | pending | |
