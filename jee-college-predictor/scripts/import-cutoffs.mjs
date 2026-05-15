#!/usr/bin/env node
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createInterface } from "node:readline";

const inputPath = process.argv[2];
const outputPath = process.argv[3] ?? "src/data/imported-cutoffs.json";

if (!inputPath) {
  console.error("Usage: node scripts/import-cutoffs.mjs <josaa-csv> [output-json]");
  process.exit(1);
}

const absoluteInput = resolve(inputPath);
if (!existsSync(absoluteInput)) {
  console.error(`Input file not found: ${absoluteInput}`);
  process.exit(1);
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }

  cells.push(cell.trim());
  return cells;
}

function normalizeHeader(header) {
  return header.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const rows = [];
let headers = null;

const reader = createInterface({
  input: createReadStream(absoluteInput),
  crlfDelay: Infinity,
});

for await (const line of reader) {
  if (!line.trim()) continue;
  const cells = parseCsvLine(line);
  if (!headers) {
    headers = cells.map(normalizeHeader);
    continue;
  }

  const record = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  rows.push({
    institute: record.institute || record.institutename || record.college || record.name,
    branch: record.academicprogramname || record.program || record.branch,
    quota: record.quota || "AI",
    seatType: record.seattype || record.category || "OPEN",
    gender: record.gender || "Gender-Neutral",
    openingRank: Number.parseInt(record.openingrank || record.or || "", 10) || null,
    closingRank: Number.parseInt(record.closingrank || record.cr || "", 10) || null,
    year: Number.parseInt(record.year || "2024", 10),
    round: record.round || "Imported",
    source: absoluteInput,
  });
}

const absoluteOutput = resolve(outputPath);
mkdirSync(dirname(absoluteOutput), { recursive: true });
writeFileSync(absoluteOutput, `${JSON.stringify(rows, null, 2)}\n`);

console.log(`Imported ${rows.length} cutoff rows to ${absoluteOutput}`);
