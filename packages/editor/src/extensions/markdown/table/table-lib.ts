import type { EditorState } from "@codemirror/state";
import type { SyntaxNode } from "@lezer/common";
import {
  CODE_OF_COLON,
  CODE_OF_HYPHEN,
  CODE_OF_PIPE,
  NAME_OF_TABLE_CELL,
  NAME_OF_TABLE_DELIMITER,
  NAME_OF_TABLE_HEADER,
  NAME_OF_TABLE_ROW,
} from "../markdown-model";
import {
  MIN_COLUMN_WIDTH,
  type TableAlignment,
  type TableCellModel,
  type TableMatrix,
  type TableModel,
  type TableRow,
} from "./table-model";

export function parseTable(state: EditorState, node: SyntaxNode): TableModel | undefined {
  const header = node.getChild(NAME_OF_TABLE_HEADER);
  const delimiter = node.getChild(NAME_OF_TABLE_DELIMITER);
  if (!header || !delimiter) return undefined;
  const [alignments, delimiterWidths] = parseColumns(
    state.doc.sliceString(delimiter.from, delimiter.to),
  );
  const rows: TableRow[] = [collectRowCells(state, header, 0)];
  node.getChildren(NAME_OF_TABLE_ROW).forEach((rowNode, index) => {
    rows.push(collectRowCells(state, rowNode, index + 1));
  });
  const colCount = Math.max(delimiterWidths.length, ...rows.map((row) => row.cells.length));
  const cells: TableCellModel[] = [];
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    for (let col = 0; col < colCount; col++) {
      cells.push(
        rows[rowIndex].cells[col] ?? {
          row: rowIndex,
          col,
          from: rows[rowIndex].lineTo,
          to: rows[rowIndex].lineTo,
          node: null,
          text: "",
        },
      );
    }
  }
  const firstLine = state.doc.lineAt(node.from);
  const lastLine = state.doc.lineAt(node.to);
  const firstTriggerLine =
    firstLine.number === 1 ? firstLine : state.doc.line(firstLine.number - 1);
  const lastTriggerLine =
    lastLine.number === state.doc.lines ? lastLine : state.doc.line(lastLine.number + 1);
  return {
    from: node.from,
    to: node.to,
    rowCount: rows.length,
    colCount,
    alignments,
    delimiterWidths,
    cells,
    replaceable: node.from === firstLine.from && node.to === lastLine.to,
    triggerFrom: firstTriggerLine.from,
    triggerTo: lastTriggerLine.to,
  };
}

function parseColumns(text: string): [(TableAlignment | undefined)[], number[]] {
  const alignments: (TableAlignment | undefined)[] = [];
  const delimiterWidths: number[] = [];
  let symbols = 0;
  let startMark = -1;
  let endMark = -1;

  const pushColumn = () => {
    const start = startMark === -1 ? NaN : text.charCodeAt(startMark);
    const end = endMark === -1 ? NaN : text.charCodeAt(endMark);
    if (start === CODE_OF_COLON && end === CODE_OF_COLON) alignments.push("center");
    else if (start === CODE_OF_COLON) alignments.push("left");
    else if (end === CODE_OF_COLON) alignments.push("right");
    else alignments.push(undefined);
    delimiterWidths.push(symbols);
    symbols = 0;
    startMark = -1;
    endMark = -1;
  };

  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    if (code === CODE_OF_PIPE) {
      if (symbols > 0) pushColumn();
      continue;
    }
    if (code === CODE_OF_HYPHEN) {
      if (startMark === -1) startMark = index;
      symbols++;
    } else if (code === CODE_OF_COLON) {
      if (startMark === -1) startMark = index;
      else if (endMark === -1) endMark = index;
      symbols++;
    }
  }
  if (symbols > 0) pushColumn();
  return [alignments, delimiterWidths];
}

function collectRowCells(state: EditorState, rowNode: SyntaxNode, rowIndex: number): TableRow {
  const line = state.doc.lineAt(rowNode.from);
  const cells: TableCellModel[] = [];
  let prevEnd = line.from;
  let segmentOpen = false;

  const pushEmptyCell = (from: number, to: number) => {
    const middle = from + Math.floor((to - from) / 2);
    cells.push({
      row: rowIndex,
      col: cells.length,
      from: middle,
      to: middle,
      text: "",
      node: null,
    });
  };

  let child = rowNode.firstChild;
  while (child) {
    if (child.name === NAME_OF_TABLE_CELL) {
      cells.push({
        row: rowIndex,
        col: cells.length,
        from: child.from,
        to: child.to,
        text: state.doc.sliceString(child.from, child.to),
        node: child,
      });
      segmentOpen = false;
    } else if (child.name === NAME_OF_TABLE_DELIMITER) {
      if (segmentOpen) {
        pushEmptyCell(prevEnd, child.from);
      }
      segmentOpen = true;
      prevEnd = child.to;
    }
    child = child.nextSibling;
  }

  return { cells, lineTo: line.to };
}

export function modelToMatrix(model: TableModel): TableMatrix {
  const rows: string[][] = [];
  for (let row = 0; row < model.rowCount; row++) {
    const line: string[] = [];
    for (let col = 0; col < model.colCount; col++) {
      line.push(model.cells[row * model.colCount + col]?.text ?? "");
    }
    rows.push(line);
  }
  const widths = getColumnWidths(rows).map((width, col) =>
    Math.max(width, model.delimiterWidths[col] ?? 0),
  );
  return { alignments: [...model.alignments], widths, rows };
}

function getColumnWidths(rows: string[][]): number[] {
  const widths: number[] = [];
  for (const row of rows) {
    row.forEach((cell, col) => {
      widths[col] = Math.max(widths[col] ?? 0, cell.length, MIN_COLUMN_WIDTH);
    });
  }
  return widths;
}

export function withExtraColumn(matrix: TableMatrix): TableMatrix {
  return {
    alignments: [...matrix.alignments, undefined],
    widths: [...matrix.widths, MIN_COLUMN_WIDTH],
    rows: matrix.rows.map((row) => [...row, ""]),
  };
}

export function matrixToSource(matrix: TableMatrix): string {
  const widths = getColumnWidths(matrix.rows).map((width, col) =>
    Math.max(width, matrix.widths[col] ?? 0),
  );
  const lines: string[] = [
    rowSource(widths, matrix.alignments, matrix.rows[0] ?? []),
    delimiterSource(widths, matrix.alignments),
  ];
  for (let row = 1; row < matrix.rows.length; row++) {
    lines.push(rowSource(widths, matrix.alignments, matrix.rows[row]));
  }
  return lines.join("\n");
}

export function rowSource(
  widths: number[],
  alignments: (TableAlignment | undefined)[],
  cells: string[],
): string {
  const padded = cells.map((cell, col) =>
    cellSource(cell, widths[col] ?? MIN_COLUMN_WIDTH, alignments[col]),
  );
  return `| ${padded.join(" | ")} |`;
}

function delimiterSource(widths: number[], alignments: (TableAlignment | undefined)[]): string {
  const cells = widths.map((width, col) => {
    const alignment = alignments[col];
    const marks = alignment === "center" ? 2 : alignment ? 1 : 0;
    const dashes = "-".repeat(Math.max(width - marks, MIN_COLUMN_WIDTH - marks, 1));
    switch (alignment) {
      case "left":
        return `:${dashes}`;
      case "right":
        return `${dashes}:`;
      case "center":
        return `:${dashes}:`;
      default:
        return dashes;
    }
  });
  return `| ${cells.join(" | ")} |`;
}

function cellSource(cell: string, width: number, alignment: TableAlignment | undefined): string {
  const spaces = " ".repeat(Math.max(width - cell.length, 0));
  switch (alignment) {
    case "right":
      return spaces + cell;
    case "center": {
      const half = Math.floor(spaces.length / 2);
      return spaces.slice(0, half) + cell + spaces.slice(half);
    }
    default:
      return cell + spaces;
  }
}
