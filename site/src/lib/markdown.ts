import type { TocItem } from "./types";

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

function cells(row: string): string[] {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparator(row: string): boolean {
  const parsed = cells(row);
  return parsed.length > 0 && parsed.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function renderTable(rows: string[], label: string): string {
  const header = cells(rows[0] ?? "");
  const bodyRows = rows.filter((row, index) => index > 0 && !isSeparator(row));
  const head = header.map((cell) => `<th>${inline(cell)}</th>`).join("");
  const body = bodyRows
    .map((row) => {
      const rendered = cells(row)
        .map((cell) => `<td>${inline(cell)}</td>`)
        .join("");
      return `<tr>${rendered}</tr>`;
    })
    .join("");
  // Focusable and named so a keyboard user can scroll a wide table inside its frame.
  const name = escapeHtml(label ? `Table: ${label}` : "Table");
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="${name}"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

export type RenderOptions = {
  /** Append a copyable "#" link to each h2 and h3. Heading ids are the same either way. */
  anchors?: boolean;
};

export function renderMarkdown(
  markdown: string,
  options: RenderOptions = {},
): { html: string; toc: TocItem[] } {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();
  let index = 0;
  let lastHeading = "";

  function uniqueId(text: string): string {
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count + 1}`;
  }

  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const table: string[] = [];
      while (index < lines.length && (lines[index] ?? "").startsWith("|")) {
        table.push(lines[index] ?? "");
        index += 1;
      }
      html.push(renderTable(table, lastHeading));
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1]?.length ?? 1;
      const text = heading[2]?.trim() ?? "";
      const id = uniqueId(text);
      const inToc = level === 2 || level === 3;
      if (inToc) toc.push({ id, text, level });
      lastHeading = text.replace(/\*/g, "");
      const anchor =
        options.anchors && inToc
          ? ` <a class="heading-anchor" href="#${id}"><span aria-hidden="true">#</span><span class="visually-hidden">Link to this section</span></a>`
          : "";
      html.push(`<h${level} id="${id}">${inline(text)}${anchor}</h${level}>`);
      index += 1;
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      (lines[index] ?? "").trim() !== "" &&
      !(lines[index] ?? "").startsWith("#") &&
      !(lines[index] ?? "").startsWith("|")
    ) {
      paragraph.push(lines[index] ?? "");
      index += 1;
    }
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
  }

  return { html: html.join("\n"), toc };
}

export function sectionAfterHeading(
  markdown: string,
  headingPattern: RegExp,
): { id: string; heading: string; html: string } {
  const match = headingPattern.exec(markdown);
  if (!match || match.index === undefined) {
    throw new Error(`No section matched ${headingPattern}`);
  }
  const heading = match[0].replace(/^###\s+/, "");
  const rest = markdown.slice(match.index + match[0].length);
  const next = /^#{1,3} /m.exec(rest);
  const body = (next ? rest.slice(0, next.index) : rest).trim();
  const id = slugify(heading);
  return { id, heading, html: renderMarkdown(body).html };
}
