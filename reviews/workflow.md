# Neuroscience review workflow

`reviews/run.py` walks the queue. Each section is one fresh Cursor agent call, with that section pasted into the prompt. The call ends, and the script stores the card. Row 109 costs the same as row 1.

The four doctrine sheets stay as they are: `citta.md`, `cetasika.md`, `sampayoga.md`, and `vithi.md`. The script writes review cards, a rollup per finished sheet, and a draft concordance. Scenario answers keep using the sheets.

## What this is deciding

Each row asks what modern neuroscience can say about that section. A phenomenon, here, is something that shows up and can be pointed at: a person can notice it, and a study can try to measure something in that neighborhood. `dosa` (hatred) as a rejecting feel is a phenomenon. "Greed and hatred never co-arise" is a rule about when that phenomenon may be present. Rebirth-linking is a claim no feeling-report or scan is built to test.

`supported` means the literature has a nearby construct. It leaves the sheet's definition, similes, and counts as traditional doctrine.

## Order

`reviews/queue.tsv` is the live queue. Status lives there, not in this file. The sheets are ordered by how close their units sit to something a study can measure.

1. `cetasika.md` — mental factors. Attention, feeling, craving, aversion, mindfulness, and compassion are the nearest constructs.
2. `vithi.md` — timing. This is where a mind-moment and a lab's timescale come apart.
3. `sampayoga.md` — combination rules. Most exclusivity rules will come back as timescale mismatches.
4. `citta.md` — the classification. Ask whether a distinction still earns its place.

There are 52 cetasika rows, 19 vithi rows, 15 sampayoga rows, and 23 citta rows. Empty group headings are omitted.

## How to run it

Install the Cursor CLI and set a key, then start the script once:

```bash
curl https://cursor.com/install -fsS | bash
export CURSOR_API_KEY=your_api_key_here
python reviews/run.py
```

The script calls `agent --print --trust --output-format text` once per pending row. It does not pass `--force`. `.cursor/cli.json` denies reads and writes of the doctrine sheets and denies shell commands, and it allows web fetch so a call can open a paper. The script, not the agent, writes `reviews/cards/<id>.md` and updates the queue.

A row left `in-progress` or `failed` is retried on the next start. `done` rows are skipped. Raw text from a failed call is kept in `reviews/raw/`, which is gitignored.

```bash
python reviews/run.py --dry-run          # print the next prompt and exit
python reviews/run.py --limit 1          # one section, then stop
python reviews/run.py --sheet cetasika.md
python reviews/run.py --check            # done rows, cards, and verdict labels
python reviews/run.py --self-test        # parser and queue against the sheets
```

When the last row of a sheet is done, the script asks for one rollup from that sheet's verdict lines and writes `reviews/rollup-<sheet>.md`. When every row is done, it writes `reviews/concordance.md` from the queue. The concordance is a draft. Changing how scenario answers speak waits until you accept an entry.

This script does not check that a citation resolves. A finished card can still name a source that does not exist.

## Verdicts

The agent picks one label for the section:

| Label | Meaning |
| --- | --- |
| `supported` | A nearby construct has a real literature: reviews or several converging studies. |
| `different-grain` | The research is about the same neighborhood, at a coarser timescale than one mind-moment. |
| `contested` | The literature splits, or the methods are too weak to carry the claim. |
| `not-a-science-question` | The section is rebirth, path and fruition, kamma as a moral ledger, or another claim no experiment is built to test. |

The prompt in `reviews/run.py` is the copy the agent sees. It caps a card at 400 words, allows three sources, and tells the agent to write "No direct literature" instead of borrowing a neighboring finding.
