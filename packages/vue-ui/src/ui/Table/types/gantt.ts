import type { TableProps } from "./table";
import type {
  CellClassInterface,
  CellRenderComponent,
  DefaultRow,
  FilterFn,
  FilterRenderComponent,
  HeaderClassInterface,
  HeaderRenderComponent,
  RowInterface,
  SortFn,
  SortRenderComponent,
} from "./utils";

export type GanttTaskArrowInfo = {
  up: boolean;
  down: boolean;
};

export type GanttTaskProps<RowData extends DefaultRow> = {
  rowInfo: GanttRowInfo | undefined;
  arrows: GanttTaskArrowInfo;
  maxTextWidth: number | undefined;
  duration: number;
  row: RowInterface<GanttInfo<RowData>>;
  bodyWidth: number | null;
};
export type GanttTooltipProps<RowData extends DefaultRow> = {
  row: RowInterface<RowData>;
};

export type GanttDate = [string | number, string | number];
export type GanttSize = "sm" | "lg";
export type GanttTypeShapes = "task" | "group" | "milestone";
export type GanttViewType = "years" | "months" | "quarters" | "weeks";

export type GanttLinkStyleGetter<RowData extends DefaultRow> = (
  info: GanttInfo<RowData>,
  link: GanttLink,
) => GanttLinkStyle | undefined;
export type GanttLinkStyle = {
  size?: number;
  color?: string;
  arrowSize?: number;
  cornerSize?: number;
};

export type GanttLink =
  | string
  | number
  | {
      id: number | string;
      type?: string | number;
    };

export type GanttInfo<RowData extends DefaultRow> = {
  id: number | string;
  start: string;
  end: string;
  name: string;
  type?: GanttTypeShapes;
  progress?: number;
  links?: GanttLink[];
  data: RowData;
  children?: GanttInfo<RowData>[];
};

export type GanttDateInfo = {
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

export type GanttHeaderInfo = {
  year: number;
  months: number[];
};

export type GanttRowLinks = {
  index: number;
  left: number;
  top: number;
  links: GanttLinkDrawInstruction[];
};

export type GanttLinkDrawInstruction = {
  id: string;
  color: string | undefined;
  size: number;
  position: "up" | "down";
  dependentIndex: number;
  extraCorner: boolean;
  leftToRightFirst: number;
  leftToRightSecond: number;
  rightToLeft: number;
  topToBottom: number;
  topToBottomExtra: number;
  topArrowShift: number;
  arrowSize: number;
  cornerSize: number;
};

export type GanttProps<
  RowData extends DefaultRow,
  CellRender extends Record<string, CellRenderComponent<GanttInfo<RowData>>>,
  HeaderRender extends Record<string, HeaderRenderComponent<GanttInfo<RowData>>>,
  FilterRender extends Record<string, FilterRenderComponent<GanttInfo<RowData>>>,
  SortRender extends Record<string, SortRenderComponent<GanttInfo<RowData>>>,
  CellClass extends Record<string, CellClassInterface<GanttInfo<RowData>>>,
  HeaderClass extends Record<string, HeaderClassInterface<GanttInfo<RowData>>>,
  FilterType extends Record<string, FilterFn<GanttInfo<RowData>>>,
  SortType extends Record<string, SortFn<GanttInfo<RowData>>>,
> = {
  ganttIntervalDate?: GanttDate;
  ganttSize?: GanttSize;
  ganttGraphGrid?: boolean;
  ganttSplitterInstant?: boolean;
  ganttLinkGetAround?: boolean;
  ganttLinkVisibleInRange?: boolean;
  ganttLinkHighlight?: boolean;
  ganttToday?: boolean;
  ganttTodayInteractive?: boolean;
  ganttView?: GanttViewType;
  ganttLinkStyleGetter?: GanttLinkStyleGetter<RowData>;
} & Omit<
  TableProps<
    GanttInfo<RowData>,
    CellRender,
    HeaderRender,
    FilterRender,
    SortRender,
    CellClass,
    HeaderClass,
    FilterType,
    SortType
  >,
  "withPagination"
>;
