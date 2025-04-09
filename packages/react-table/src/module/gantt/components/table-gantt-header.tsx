import React from "react";
import { GANTT_HEADER_HEIGHT } from "../gantt.constants";
import type { HeaderItem } from "../hooks";
import { getShortMonthName } from "../lib";
import styles from "./table-gantt-header.module.scss";

type GanttHeaderProps = {
  headerItems: HeaderItem[];
  width: number;
  locale: string | undefined;
};

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

export function GanttQuarterHeader(props: GanttHeaderProps) {
  const quarters = React.useMemo(() => {
    const quarters: { quarter: number; months: number }[] = [];
    let currentIndex = 0;
    for (let i = 0; i < props.headerItems.length; i++) {
      const item = props.headerItems[i];

      for (let j = 0; j < item.months.length; j++) {
        const month = item.months[j];
        if ((month === 0 || month === 3 || month === 6 || month === 9) && quarters[currentIndex]) {
          currentIndex++;
        }

        if (!quarters[currentIndex]) {
          switch (month) {
            case 0:
            case 1:
            case 2: {
              quarters.push({ quarter: 1, months: 0 });
              break;
            }
            case 3:
            case 4:
            case 5: {
              quarters.push({ quarter: 2, months: 0 });

              break;
            }
            case 6:
            case 7:
            case 8: {
              quarters.push({ quarter: 3, months: 0 });

              break;
            }
            case 9:
            case 10:
            case 11: {
              quarters.push({ quarter: 4, months: 0 });
              break;
            }
            default: {
              break;
            }
          }
        }

        quarters[currentIndex].months += 1;
      }
    }

    return quarters;
  }, [props.headerItems]);

  return (
    <>
      {/** HEADER ROW YEAR */}
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
                justifyContent: "center",
              }}
            >
              {item.year}
            </div>
          );
        })}
      </div>
      {/** HEADER ROW QUARTER */}
      <div
        data-id="header-row"
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
      >
        {quarters.map((quarter, index) => {
          return (
            <div
              data-id="header-cell"
              className={styles.headerCell}
              key={`${quarter.quarter}${index}`}
              style={{
                minWidth: props.width * quarter.months,
                maxWidth: props.width * quarter.months,
                justifyContent: "center",
              }}
            >
              {`Q${quarter.quarter}`}
            </div>
          );
        })}
      </div>
      {/** HEADER ROW MONTH */}
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

export function GanttMonthHeader(props: GanttHeaderProps) {
  return (
    <>
      {/** HEADER ROW YEAR */}
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
                justifyContent: "center",
              }}
            >
              {item.year}
            </div>
          );
        })}
      </div>
      {/** HEADER ROW MONTH */}
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

export function GanttWeekHeader(props: GanttHeaderProps) {
  return (
    <>
      {/** HEADER ROW YEAR */}
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
                minWidth: props.width * item.months.length * 4,
                maxWidth: props.width * item.months.length * 4,
                justifyContent: "center",
              }}
            >
              {item.year}
            </div>
          );
        })}
      </div>
      {/** HEADER ROW MONTH */}
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
                style={{ minWidth: props.width * 4, maxWidth: props.width * 4 }}
              >
                {getShortMonthName(month, props.locale)}
              </div>
            );
          });
        })}
      </div>
      {/** HEADER ROW WEEK */}
      <div
        data-id="header-row"
        className={styles.headerRow}
        style={{ minHeight: GANTT_HEADER_HEIGHT, maxHeight: GANTT_HEADER_HEIGHT }}
      >
        {props.headerItems.map((item) => {
          return item.months.map((month) => {
            return Array.from({ length: 4 }, (_, index) => {
              return (
                <div
                  data-id="header-cell"
                  className={styles.headerCell}
                  key={`${item.year}${month}${index}`}
                  style={{ minWidth: props.width, maxWidth: props.width }}
                >
                  {`W${index + 1}`}
                </div>
              );
            });
          });
        })}
      </div>
    </>
  );
}
