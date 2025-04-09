import { GANTT_HEADER_HEIGHT } from "../gantt.constants";
import type { HeaderItem } from "../hooks";
import { getShortMonthName } from "../lib";
import styles from "./table-gantt-header.module.scss";

type GanttHeaderProps = {
  headerItems: HeaderItem[];
  width: number;
  locale: string | undefined;
};

export function GanttMonthHeader(props: GanttHeaderProps) {
  return (
    <>
      {/** HEADER ROW */}
      <div
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
        data-id="header-row"
      >
        {props.headerItems.map((item) => {
          return (
            <div
              data-id="header-cell"
              className={styles.headerCell}
              key={item.year}
              style={{
                minWidth: props.width * item.months.length,
                maxWidth: props.width * item.months.length,
              }}
            >
              {item.year}
            </div>
          );
        })}
      </div>
      {/** HEADER ROW */}
      <div
        data-id="header-row"
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
      >
        {props.headerItems.map((item) => {
          return item.months.map((month) => {
            return (
              <div
                data-id="header-cell"
                className={styles.headerCell}
                key={`${item.year}${month}`}
                style={{ minWidth: props.width, maxWidth: props.width }}
              >
                {getShortMonthName(month, props.locale)}
              </div>
            );
          });
        })}
      </div>
    </>
  );
}

export function GanttYearHeader(props: GanttHeaderProps) {
  const firstYear = props.headerItems[0].year;
  const lastYear = props.headerItems[props.headerItems.length - 1].year;

  return (
    <>
      {/** HEADER ROW */}
      <div
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
        data-id="header-row"
      >
        <div
          data-id="header-cell"
          className={styles.headerCell}
          style={{
            minWidth: props.width * props.headerItems.length,
            maxWidth: props.width * props.headerItems.length,
            justifyContent: "center",
          }}
        >
          {firstYear !== lastYear ? `${firstYear} - ${lastYear}` : firstYear}
        </div>
      </div>
      {/** HEADER ROW */}
      <div
        data-id="header-row"
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
      >
        {props.headerItems.map((item) => {
          return (
            <div
              data-id="header-cell"
              className={styles.headerCell}
              key={item.year}
              style={{ minWidth: props.width, maxWidth: props.width }}
            >
              {item.year}
            </div>
          );
        })}
      </div>
    </>
  );
}
