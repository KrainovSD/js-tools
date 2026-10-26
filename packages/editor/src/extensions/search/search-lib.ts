import { type ChangeSet, type Text } from "@codemirror/state";
import { toLowerLetterCode } from "../markdown/markdown-lib";
import { MAX_SEARCH_MATCHES, type SearchMatch } from "./search-model";

export function getCharCodes(text: string): number[] {
  const codes: number[] = [];
  for (let pos = 0; pos < text.length; pos++) {
    codes.push(toLowerLetterCode(text.charCodeAt(pos)));
  }
  return codes;
}

export function findMatches(doc: Text, codes: number[]): SearchMatch[] {
  return scanMatches(doc, codes, 0, MAX_SEARCH_MATCHES);
}

export function updateMatches(
  changes: ChangeSet,
  doc: Text,
  codes: number[],
  matches: SearchMatch[],
): SearchMatch[] {
  const firstFrom = getFirstChangePos(changes);
  if (firstFrom < 0) return scanMatches(doc, codes, 0, MAX_SEARCH_MATCHES);

  let low = 0;
  let high = matches.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (matches[mid].to <= firstFrom) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  const lastKeptEnd = low ? matches[low - 1].to : -1;
  const rescanned = scanMatches(
    doc,
    codes,
    Math.max(0, firstFrom - codes.length + 1),
    MAX_SEARCH_MATCHES - low,
  );
  let drop = 0;
  while (drop < rescanned.length && rescanned[drop].from < lastKeptEnd) {
    drop++;
  }
  return matches.slice(0, low).concat(rescanned.slice(drop));
}

function getFirstChangePos(changes: ChangeSet): number {
  let firstFrom = -1;
  changes.iterChanges((fromA) => {
    if (firstFrom < 0 || firstFrom > fromA) firstFrom = fromA;
  });
  return firstFrom;
}

function scanMatches(doc: Text, codes: number[], from: number, limit: number): SearchMatch[] {
  const matches: SearchMatch[] = [];
  if (!codes.length || limit <= 0) return matches;
  const failure = new Array<number>(codes.length);
  failure[0] = 0;
  for (let index = 1, len = 0; index < codes.length; index++) {
    while (len > 0 && codes[index] !== codes[len]) {
      len = failure[len - 1];
    }
    if (codes[index] === codes[len]) {
      len++;
    }
    failure[index] = len;
  }

  let matched = 0;
  let pos = from;
  const iterator = doc.iter();
  if (from > 0) iterator.next(from);
  while (!iterator.done) {
    const chunk = iterator.value;
    for (let index = 0; index < chunk.length; index++) {
      const code = toLowerLetterCode(chunk.charCodeAt(index));
      while (matched > 0 && code !== codes[matched]) {
        matched = failure[matched - 1];
      }
      if (code === codes[matched]) {
        matched++;
      }
      if (matched === codes.length) {
        matches.push({ from: pos + 1 - codes.length, to: pos + 1 });
        matched = 0;
        if (matches.length >= limit) {
          return matches;
        }
      }
      pos++;
    }
    iterator.next();
  }
  return matches;
}
