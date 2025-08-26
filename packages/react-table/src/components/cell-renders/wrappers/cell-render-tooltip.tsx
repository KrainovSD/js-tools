import { isArray, isBoolean, isId, isObject } from "@krainovsd/js-helpers";
import { Tooltip as TooltipLibrary } from "@krainovsd/react-ui";
import { getData } from "../../../lib";
import type { ColumnTooltipSettings, DefaultRow } from "../../../types";
import styles from "./cell-render-tooltip.module.scss";

export type CellRenderTooltipProps<RowData extends DefaultRow> = {
  tooltip?: ColumnTooltipSettings<RowData> | boolean;
  row: RowData;
  content: string | number | boolean;
};

export function CellRenderTooltip<RowData extends DefaultRow>(
  props: React.PropsWithChildren<CellRenderTooltipProps<RowData>>,
) {
  let content = props.content;
  if (isObject(props.tooltip)) {
    if (props.tooltip.customContent) {
      content = props.tooltip.customContent;
    }
    if (props.tooltip.pathToContent) {
      const tooltipContent = getData(props.row, props.tooltip.pathToContent);
      if (isId(tooltipContent) || isBoolean(tooltipContent)) {
        content = tooltipContent;
      }
      if (isArray(tooltipContent)) {
        content = tooltipContent.join(props.tooltip.arraySeparator ?? ", ");
      }
    }
  }

  if (!props.tooltip) return props.children;

  return (
    <TooltipLibrary
      classNameContent={styles.tooltip}
      text={content}
      autoTooltip={isObject(props.tooltip) ? props.tooltip.auto : false}
      zIndex={isObject(props.tooltip) ? props.tooltip.zIndex : undefined}
    >
      {props.children}
    </TooltipLibrary>
  );
}
