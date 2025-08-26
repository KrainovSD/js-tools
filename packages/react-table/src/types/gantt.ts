import type { DefaultGanttData, DefaultRow, RowInterface } from "./utils";

export type GanttTaskProps<RowData extends DefaultRow, GanttData extends DefaultGanttData> = {
  row: RowInterface<RowData>;
  ganttInfo: GanttInfo<GanttData>;
  rowInfo: GanttRowInfo;
  bodyWidth: number | null;
  rowsMap: Record<string | number, GanttRowInfo | undefined>;
  hasUpArrow: boolean;
  hasDownArrow: boolean;
};
export type GanttTooltipProps<RowData extends DefaultRow> = {
  row: RowInterface<RowData>;
};

export type GanttArrowStyleGetter<GanttData extends DefaultGanttData> = (
  info: GanttInfo<GanttData>,
) => GanttArrowStyle | undefined;
export type GanttArrowStyle = {
  color?: string;
  size?: number;
};

export type GanttProps<RowData extends DefaultRow, GanttData extends DefaultGanttData> = {
  withGantt?: boolean;
  firstGanttDate?: string;
  lastGanttDate?: string;
  ganttRowMini?: boolean;
  ganttInfoGetter?: (row: RowInterface<RowData>) => GanttInfo<GanttData>;
  ganttArrowStyleGetter?: GanttArrowStyleGetter<GanttData>;
  instantGanttSplitter?: boolean;
  ganttGrid?: boolean;
  GanttTooltip?: React.FC<GanttTooltipProps<RowData>>;
  GanttTask?: React.FC<GanttTaskProps<RowData, GanttData>> | undefined;
  ganttView?: GanttViewType;
};

export type GanttTypeShapes = "task" | "group" | "milestone";
export type GanttViewType = "years" | "months" | "quarters" | "weeks";

export type GanttInfo<GanttData extends DefaultGanttData> = {
  id: number | string;
  start: string;
  end: string;
  name: string;
  type: GanttTypeShapes;
  progress?: number;
  dependents?: (string | number)[];
  props?: GanttData;
};

export type GanttDate = {
  year: number;
  month: number;
  day: number;
};

export type GanttRowInfo = {
  index: number;
  left: number;
  top: number;
  width: number;
  height: number;
  textWidth: number;
};
