import {
  type AnnotationType,
  type ChangeSpec,
  EditorState,
  type Line,
  type Text,
  Transaction,
  type TransactionSpec,
} from "@codemirror/state";

export function NewListRenumber(ySyncAnnotation: AnnotationType<unknown> | undefined) {
  const verifiedLines = new Set<number>();

  return EditorState.transactionFilter.of(
    (transaction: Transaction): Transaction | readonly TransactionSpec[] => {
      if (!transaction.docChanged) return transaction;
      if (ySyncAnnotation && transaction.annotation(ySyncAnnotation) !== undefined) {
        verifiedLines.clear();
        return transaction;
      }
      const doc = transaction.newDoc;
      const seedLines = new Set<number>();
      const changed = collectSeeds(transaction, doc, seedLines);
      if (!changed && isVerified(seedLines, verifiedLines)) return transaction;
      verifiedLines.clear();
      const blocks = collectOrderedBlocks(doc, seedLines, verifiedLines);
      const changes = buildRenumberChanges(blocks);
      if (!changes.length) return transaction;
      const userEvent = transaction.annotation(Transaction.userEvent);
      return [
        {
          changes: transaction.changes,
          selection: transaction.selection,
          effects: transaction.effects,
          scrollIntoView: transaction.scrollIntoView,
          ...(userEvent ? { userEvent } : {}),
        },
        { changes, sequential: true },
      ];
    },
  );
}

function collectSeeds(transaction: Transaction, doc: Text, seedLines: Set<number>): boolean {
  const oldDoc = transaction.startState.doc;
  let changed = false;
  transaction.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
    seedLines.add(doc.lineAt(Math.min(toB, doc.length)).number);
    const line = doc.lineAt(fromB).number;
    seedLines.add(line);
    if (line > 1) {
      seedLines.add(line - 1);
    }
    if (line < doc.lines) {
      seedLines.add(line + 1);
    }
    if (changed) return;
    if (inserted.lines > 1) {
      changed = true;
    } else if (toA > fromA && oldDoc.lineAt(fromA).number !== oldDoc.lineAt(toA).number) {
      changed = true;
    } else {
      const line = oldDoc.lineAt(fromA);
      const item = getItem(line.text);
      if (fromA - line.from < (item ? item.prefixLength : 1)) {
        changed = true;
      }
    }
  });
  return changed;
}

function isVerified(seedLines: Set<number>, verifiedLines: Set<number>): boolean {
  for (const line of seedLines) {
    if (!verifiedLines.has(line)) return false;
  }
  return true;
}

type ItemLine = {
  indent: number;
  delimiter: number;
  number: number;
  numberLength: number;
  prefixLength: number;
};

type ListEntry = { from: number; indentLength: number; number: number; numberLength: number };

// bad cache pattern
// const ITEM_CACHE_LIMIT = 8192;
// const itemCache = new Map<string, ItemLine | undefined>();

function getItem(text: string): ItemLine | undefined {
  // if (!itemCache.has(text)) {
  //   if (itemCache.size >= ITEM_CACHE_LIMIT) itemCache.clear();
  //   itemCache.set(text, getItemLine(text));
  // }
  // return itemCache.get(text);
  return getItemLine(text);
}

function getItemLine(text: string): ItemLine | undefined {
  let pos = 0;
  /* " ", /t */
  while (text.charCodeAt(pos) === 32 || text.charCodeAt(pos) === 9) pos++;
  const numberStart = pos;
  /* /d */
  while (text.charCodeAt(pos) >= 48 && text.charCodeAt(pos) <= 57) pos++;
  const code = text.charCodeAt(pos);
  /* ".", ")"  */
  if (code !== 46 && code !== 41) {
    return undefined;
  }
  const separator = text.charCodeAt(pos + 1);
  /* " ", /t */
  if (separator !== 32 && separator !== 9 && !Number.isNaN(separator)) {
    return undefined;
  }
  const numberLength = pos - numberStart;
  if (numberLength < 1) {
    return undefined;
  }
  return {
    indent: numberStart,
    delimiter: code,
    number: Number(text.slice(numberStart, pos)),
    numberLength,
    prefixLength: numberStart + numberLength + 2,
  };
}

type ListBlock = { fromLine: number; toLine: number; indent: number; entries: ListEntry[] };

function collectOrderedBlocks(
  doc: Text,
  seedLines: Set<number>,
  verified: Set<number>,
): ListBlock[] {
  const blocks: ListBlock[] = [];
  for (const seed of seedLines) {
    if (seed < 1 || seed > doc.lines) continue;
    const seedLine = doc.line(seed);
    const seedItem = getItem(seedLine.text);
    if (
      !seedItem ||
      blocks.some(
        (block) =>
          seed >= block.fromLine && seed <= block.toLine && seedItem.indent === block.indent,
      )
    )
      continue;
    const { indent, delimiter } = seedItem;
    const above: ListEntry[] = [];
    let fromLine = seed - 1;
    while (fromLine > 0) {
      const line: Line = doc.line(fromLine);
      const item = getItem(line.text);
      const kind = classifyLine(item, indent, delimiter, line.text.trim().length);
      if (kind === "stop") {
        break;
      } else if (kind === "continue") {
        verified.add(fromLine);
      } else if (kind === "entry" && item) {
        verified.add(fromLine);
        above.unshift(toEntry(line, item));
      }
      fromLine--;
    }
    const below: ListEntry[] = [];
    let toLine = seed + 1;
    while (toLine <= doc.lines) {
      const line: Line = doc.line(toLine);
      const item = getItem(line.text);
      const kind = classifyLine(item, indent, delimiter, line.text.trim().length);
      if (kind === "stop") {
        break;
      } else if (kind === "continue") {
        verified.add(toLine);
      } else if (kind === "entry" && item) {
        verified.add(toLine);
        below.push(toEntry(line, item));
      }
      toLine++;
    }
    verified.add(seed);
    const seedEntry = [toEntry(seedLine, seedItem)];
    blocks.push({
      fromLine: fromLine + 1,
      toLine: toLine - 1,
      indent,
      entries: [...above, ...seedEntry, ...below],
    });
  }
  return blocks;
}

function toEntry(line: Line, item: ItemLine): ListEntry {
  return {
    from: line.from + item.indent,
    indentLength: item.indent,
    number: item.number,
    numberLength: item.numberLength,
  };
}

type LineKind = "entry" | "continue" | "nested" | "stop";

function classifyLine(
  item: ItemLine | undefined,
  indent: number,
  delimiter: number,
  textLength: number,
): LineKind {
  if (!item) {
    return textLength === 0 ? "stop" : "continue";
  }
  if (item.indent === indent) {
    return item.delimiter === delimiter ? "entry" : "stop";
  }
  return item.indent > indent ? "nested" : "stop";
}

function buildRenumberChanges(blocks: ListBlock[]): ChangeSpec[] {
  const changes: ChangeSpec[] = [];
  for (const block of blocks) {
    let counter: number = 1;
    for (const entry of block.entries) {
      if (entry.number !== counter) {
        changes.push({
          from: entry.from,
          to: entry.from + entry.numberLength,
          insert: String(counter),
        });
      }
      counter++;
    }
  }
  return changes;
}
