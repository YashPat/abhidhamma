#!/usr/bin/env python3
"""Review one Abhidhamma section per fresh Cursor agent call.

The script is the walker. Each `agent --print` invocation gets one section,
pasted into the prompt, and then exits. Progress lives in reviews/queue.tsv.
"""

from __future__ import annotations

import argparse
import csv
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVIEWS = ROOT / "reviews"
QUEUE = REVIEWS / "queue.tsv"
CARDS = REVIEWS / "cards"
RAW = REVIEWS / "raw"
FIELDS = ["id", "sheet", "start", "end", "section", "status", "verdict", "sentence"]
SHEETS = ["cetasika.md", "vithi.md", "sampayoga.md", "citta.md"]
LABELS = (
    "supported",
    "different-grain",
    "contested",
    "not-a-science-question",
)
LABEL_PATTERN = "|".join(LABELS)
VERDICT_RE = re.compile(
    rf"^(?P<id>[a-z0-9-]+) \| (?P<label>{LABEL_PATTERN}) \| (?P<sentence>.+)$"
)
RETRY_STATUSES = {"pending", "in-progress", "failed"}
CARD_WORD_WARN = 400


def strip_marks(text: str) -> str:
    normalized = unicodedata.normalize("NFD", text)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")


def slugify(title: str) -> str:
    left = title.split(" — ", 1)[0]
    left = re.sub(r"^[\d–\-]+\.\s*", "", left)
    left = strip_marks(left).lower().replace("—", " ").replace("–", " ")
    return re.sub(r"[^a-z0-9]+", "-", left).strip("-")


def build_rows() -> list[dict[str, str]]:
    """One row per heading that has body text, in sheet order."""
    rows: list[dict[str, str]] = []
    for sheet in SHEETS:
        lines = (ROOT / sheet).read_text(encoding="utf-8").splitlines()
        heads: list[tuple[int, int, str]] = []
        for number, line in enumerate(lines, 1):
            if line.startswith("## ") or line.startswith("### "):
                level = 2 if line.startswith("## ") else 3
                heads.append((number, level, line.lstrip("# ").strip()))
        count = 0
        prefix = sheet.removesuffix(".md")
        for index, (start, level, title) in enumerate(heads):
            end = heads[index + 1][0] - 1 if index + 1 < len(heads) else len(lines)
            body = [line for line in lines[start:end] if line.strip()]
            if level == 2 and not body:
                continue
            count += 1
            rows.append(
                {
                    "id": f"{prefix}-{count:02d}-{slugify(title)}",
                    "sheet": sheet,
                    "start": str(start),
                    "end": str(end),
                    "section": title,
                    "status": "pending",
                    "verdict": "",
                    "sentence": "",
                }
            )
    ids = [row["id"] for row in rows]
    if len(ids) != len(set(ids)):
        raise SystemExit("queue ids are not unique")
    return rows


def load_queue() -> list[dict[str, str]]:
    with QUEUE.open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle, delimiter="\t"))


def save_queue(rows: list[dict[str, str]]) -> None:
    temporary = QUEUE.with_suffix(".tsv.tmp")
    with temporary.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=FIELDS, delimiter="\t", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
    temporary.replace(QUEUE)


def section_text(row: dict[str, str]) -> str:
    lines = (ROOT / row["sheet"]).read_text(encoding="utf-8").splitlines()
    start, end = int(row["start"]), int(row["end"])
    return "\n".join(lines[start - 1 : end]).strip() + "\n"


def build_prompt(row: dict[str, str], text: str) -> str:
    return f"""Review one Abhidhamma section against modern neuroscience.

The section is pasted below. Do not open files. Do not edit files. Print the review to stdout.

A phenomenon is something that shows up and can be pointed at, in experience and at least roughly in a study. Classify each proposition as phenomenological, structural, temporal, or outside-the-method.

This is {row["id"]} from {row["sheet"]}, lines {row["start"]}–{row["end"]}: {row["section"]}.

Section:

{text}
Write the card, then a verdict line, using these markers exactly:

---CARD---
# {row["id"]}

- Sheet: {row["sheet"]}
- Lines: {row["start"]}–{row["end"]}
- Section: {row["section"]}

## Propositions

- (<type>) one sentence, quoted or closely paraphrased from the section

## Sources

### <citation>
- Camp:
- Measured:
- Finding: at most 80 words

## Verdict

- Label: <one label>
- At most 120 words.
---VERDICT---
{row["id"]} | <label> | <one sentence a reader could put beside this section>

Rules:
- Labels are only: supported, different-grain, contested, not-a-science-question.
- supported means a nearby construct has reviews or several converging studies. It does not confirm the sheet's definition or its counts.
- different-grain means the research is in the same neighborhood at a coarser timescale than one mind-moment.
- contested means the literature splits, or the methods are too weak to carry the claim.
- not-a-science-question means rebirth, path and fruition, kamma as a moral ledger, or another claim no experiment is built to test. Do not search for these. Say so under Sources.
- At most three sources. Prefer a systematic review, a meta-analysis, or a consensus paper. Name the theoretical camp when it changes the verdict.
- A single unreplicated imaging paper cannot carry supported.
- If nothing direct exists, write "No direct literature" and do not substitute a neighboring finding.
- The card stays under 400 words. Do not copy a paper's body.
- Print nothing before ---CARD--- and nothing after the verdict line.
"""


def parse_response(response: str, expected_id: str) -> tuple[str, str, str]:
    text = response.strip()
    if "---CARD---" in text and "---VERDICT---" in text:
        card = text.split("---CARD---", 1)[1].split("---VERDICT---", 1)[0].strip()
        verdict_zone = text.split("---VERDICT---", 1)[1]
    else:
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        if not lines:
            raise ValueError("empty response")
        verdict_zone = lines[-1]
        card = text[: text.rfind(lines[-1])].strip()
    verdict_line = next((line.strip() for line in verdict_zone.splitlines() if line.strip()), "")
    match = VERDICT_RE.match(verdict_line)
    if match is None:
        raise ValueError(f"verdict line is not in the expected shape: {verdict_line!r}")
    if match.group("id") != expected_id:
        raise ValueError(f"verdict id is {match.group('id')}, expected {expected_id}")
    if not card:
        raise ValueError("card is empty")
    return card, match.group("label"), match.group("sentence").strip()


def find_agent() -> str | None:
    found = shutil.which("agent")
    if found:
        return found
    candidate = Path.home() / ".local" / "bin" / "agent"
    if candidate.is_file():
        return str(candidate)
    return None


def call_agent(prompt: str) -> str:
    agent = find_agent()
    if agent is None:
        raise SystemExit(
            "The Cursor CLI is not installed. Install it with:\n"
            "  curl https://cursor.com/install -fsS | bash\n"
            "Then set CURSOR_API_KEY and run this script again.\n"
            "Docs: https://cursor.com/docs/cli/headless"
        )
    completed = subprocess.run(
        [
            agent,
            "--print",
            "--trust",
            "--output-format",
            "text",
            "--workspace",
            str(ROOT),
            prompt,
        ],
        cwd=ROOT,
        text=True,
        capture_output=True,
        timeout=600,
        check=False,
    )
    if completed.returncode != 0:
        detail = (completed.stderr or completed.stdout or "").strip()
        raise RuntimeError(f"agent exited {completed.returncode}: {detail[:2000]}")
    return completed.stdout


def actionable(rows: list[dict[str, str]], sheet: str | None) -> list[dict[str, str]]:
    chosen = []
    for row in rows:
        if row["status"] not in RETRY_STATUSES:
            continue
        if sheet is not None and row["sheet"] != sheet:
            continue
        chosen.append(row)
    return chosen


def fail_row(row: dict[str, str], message: str, response: str | None) -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    if response is not None:
        (RAW / f"{row['id']}.txt").write_text(response, encoding="utf-8")
    row["status"] = "failed"
    row["verdict"] = ""
    row["sentence"] = message.replace("\t", " ")[:240]


def sheet_is_done(rows: list[dict[str, str]], sheet: str) -> bool:
    return all(row["status"] == "done" for row in rows if row["sheet"] == sheet)


def write_rollup(rows: list[dict[str, str]], sheet: str) -> None:
    lines = [
        f"{row['id']} | {row['verdict']} | {row['sentence']}"
        for row in rows
        if row["sheet"] == sheet and row["status"] == "done"
    ]
    prompt = (
        "Summarize this Abhidhamma review index for one sheet. "
        "The index is pasted below. Do not open files. "
        "Name the pattern: which sections are training targets with a literature, "
        "which rules are finer than the data, and which claims stay traditional. "
        "Stay under 800 words. Print only the summary.\n\n"
        f"Sheet: {sheet}\n\n" + "\n".join(lines) + "\n"
    )
    stem = sheet.removesuffix(".md")
    destination = REVIEWS / f"rollup-{stem}.md"
    try:
        summary = call_agent(prompt).strip()
    except (RuntimeError, subprocess.TimeoutExpired) as error:
        print(f"rollup for {sheet} failed: {error}", flush=True)
        return
    destination.write_text(f"# {sheet}\n\n{summary}\n", encoding="utf-8")
    print(f"wrote {destination.relative_to(ROOT)}", flush=True)


def write_concordance(rows: list[dict[str, str]]) -> None:
    done = sum(row["status"] == "done" for row in rows)
    parts = [
        "# Draft concordance",
        "",
        "Generated from `reviews/queue.tsv`. The doctrine sheets are unchanged.",
        "Each line is the verdict a reader could put beside that section.",
        "",
        f"{done} of {len(rows)} sections are done.",
        "",
    ]
    current = None
    for row in rows:
        if row["sheet"] != current:
            current = row["sheet"]
            parts.extend([f"## {current}", "", "| section | verdict | line |", "| --- | --- | --- |"])
        if row["status"] != "done":
            parts.append(f"| {row['section']} | {row['status']} | |")
            continue
        sentence = row["sentence"].replace("|", "/")
        parts.append(f"| {row['section']} | {row['verdict']} | {sentence} |")
    parts.append("")
    destination = REVIEWS / "concordance.md"
    destination.write_text("\n".join(parts), encoding="utf-8")
    print(f"wrote {destination.relative_to(ROOT)}", flush=True)


def check(rows: list[dict[str, str]]) -> int:
    problems = 0
    done_ids = {row["id"] for row in rows if row["status"] == "done"}
    card_ids = {path.stem for path in CARDS.glob("*.md")} if CARDS.exists() else set()
    missing = sorted(done_ids - card_ids)
    extra = sorted(card_ids - done_ids)
    unlabeled = [row["id"] for row in rows if row["status"] == "done" and row["verdict"] not in LABELS]
    if missing:
        problems += 1
        print("done rows without cards:", ", ".join(missing))
    if extra:
        problems += 1
        print("cards without done rows:", ", ".join(extra))
    if unlabeled:
        problems += 1
        print("done rows with a bad verdict:", ", ".join(unlabeled))
    counts = {status: sum(row["status"] == status for row in rows) for status in ("pending", "in-progress", "failed", "done")}
    print(
        f"{counts['done']} done, {counts['pending']} pending, "
        f"{counts['in-progress']} in progress, {counts['failed']} failed, {len(rows)} total"
    )
    if problems:
        print("check failed")
        return 1
    print("check passed")
    return 0


def self_test() -> int:
    sample = """---CARD---
# cetasika-21-dosa

Hatred as a rejecting feel.
---VERDICT---
cetasika-21-dosa | different-grain | Aversion has a nearby literature at a coarser timescale.
"""
    card, label, sentence = parse_response(sample, "cetasika-21-dosa")
    assert "Hatred as a rejecting feel." in card
    assert label == "different-grain"
    assert sentence.startswith("Aversion")

    fallback = "A short card.\n\ncetasika-21-dosa | supported | Nearby reviews exist.\n"
    card, label, _sentence = parse_response(fallback, "cetasika-21-dosa")
    assert card == "A short card."
    assert label == "supported"

    failures = 0
    for response, expected, description in (
        ("cetasika-21-dosa | nope | x", "cetasika-21-dosa", "bad label"),
        ("other-id | supported | x", "cetasika-21-dosa", "wrong id"),
        ("", "cetasika-21-dosa", "empty"),
    ):
        try:
            parse_response(response, expected)
        except ValueError:
            continue
        print(f"self-test missed {description}")
        failures += 1

    built = build_rows()
    if not QUEUE.exists():
        print("self-test: queue.tsv is missing")
        return 1
    saved = load_queue()
    structural = ["id", "sheet", "start", "end", "section"]
    if [tuple(row[field] for field in structural) for row in saved] != [
        tuple(row[field] for field in structural) for row in built
    ]:
        print("self-test: queue.tsv does not match the sheet headings")
        failures += 1
    for row in saved:
        text = section_text(row)
        if not text.startswith("#"):
            print(f"self-test: {row['id']} does not start on its heading")
            failures += 1
        prompt = build_prompt(row, text)
        if row["section"] not in prompt or text.strip() not in prompt:
            print(f"self-test: prompt for {row['id']} dropped the section")
            failures += 1
    if failures:
        print(f"self-test failed ({failures})")
        return 1
    print(f"self-test passed ({len(saved)} rows)")
    return 0


def init_queue() -> None:
    if QUEUE.exists():
        raise SystemExit(f"{QUEUE} already exists. Refusing to overwrite it.")
    REVIEWS.mkdir(parents=True, exist_ok=True)
    save_queue(build_rows())
    print(f"wrote {QUEUE.relative_to(ROOT)}")


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description="Review each queued section with a fresh Cursor agent call.")
    parser.add_argument("--limit", type=int, default=0, help="Stop after this many sections. 0 means the rest of the queue.")
    parser.add_argument("--sheet", choices=SHEETS, help="Only this doctrine sheet.")
    parser.add_argument("--dry-run", action="store_true", help="Print the next prompt and exit.")
    parser.add_argument("--check", action="store_true", help="Compare done rows with cards.")
    parser.add_argument("--self-test", action="store_true", help="Check the parser and the queue against the sheets.")
    parser.add_argument("--init-queue", action="store_true", help="Write queue.tsv if it is missing.")
    parser.add_argument("--concordance", action="store_true", help="Rewrite reviews/concordance.md from the queue.")
    parser.add_argument("--rollup", action="store_true", help="Rewrite rollups for sheets whose rows are all done.")
    args = parser.parse_args(argv)

    if args.init_queue:
        init_queue()
        return 0
    if args.self_test:
        return self_test()
    if not QUEUE.exists():
        raise SystemExit("reviews/queue.tsv is missing. Run: python reviews/run.py --init-queue")
    rows = load_queue()
    if args.check:
        return check(rows)
    if args.concordance:
        write_concordance(rows)
        return 0
    if args.dry_run:
        chosen = actionable(rows, args.sheet)
        if not chosen:
            print("nothing pending")
            return 0
        print(build_prompt(chosen[0], section_text(chosen[0])))
        return 0

    if args.rollup and not args.limit:
        for sheet in SHEETS:
            if sheet_is_done(rows, sheet):
                write_rollup(rows, sheet)
        if all(row["status"] == "done" for row in rows):
            write_concordance(rows)
        return 0

    processed = 0
    seen_sheets: set[str] = set()
    try:
        for row in actionable(rows, args.sheet):
            if args.limit and processed >= args.limit:
                break
            print(f"reviewing {row['id']}", flush=True)
            row["status"] = "in-progress"
            row["sentence"] = ""
            save_queue(rows)
            response: str | None = None
            try:
                prompt = build_prompt(row, section_text(row))
                response = call_agent(prompt)
                card, label, sentence = parse_response(response, row["id"])
            except (RuntimeError, ValueError, subprocess.TimeoutExpired) as error:
                fail_row(row, str(error), response)
                save_queue(rows)
                print(f"  failed: {error}", flush=True)
                processed += 1
                continue
            words = len(card.split())
            if words > CARD_WORD_WARN:
                print(f"  warning: card is {words} words", flush=True)
            CARDS.mkdir(parents=True, exist_ok=True)
            (CARDS / f"{row['id']}.md").write_text(card.rstrip() + "\n", encoding="utf-8")
            row["status"] = "done"
            row["verdict"] = label
            row["sentence"] = sentence.replace("\t", " ")
            save_queue(rows)
            print(f"  {label}", flush=True)
            processed += 1
            seen_sheets.add(row["sheet"])
    finally:
        save_queue(rows)

    for sheet in SHEETS:
        if sheet in seen_sheets and sheet_is_done(rows, sheet):
            write_rollup(rows, sheet)
    if all(row["status"] == "done" for row in rows):
        write_concordance(rows)
    print(f"processed {processed}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except KeyboardInterrupt:
        print("\nstopped. The in-progress row will be retried on the next run.", file=sys.stderr)
        raise SystemExit(130)
