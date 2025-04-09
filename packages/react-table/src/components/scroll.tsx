import styles from "./scroll.module.scss";

type Props = {
  tableScrollRef: React.LegacyRef<HTMLDivElement>;
  tableGanttScrollRef: React.LegacyRef<HTMLDivElement>;
  sizes: number[];
};

export function Scroll(props: Props) {
  return (
    <div className={styles.base}>
      <div ref={props.tableScrollRef} className={styles.scroll} style={{ width: props.sizes[0] }}>
        <div className={styles.scroll__track}>
          <div className={styles.scroll__thumb}>
            <div className={styles.scroll__body}></div>
          </div>
        </div>
      </div>
      <div
        ref={props.tableGanttScrollRef}
        className={styles.scroll}
        style={{ width: props.sizes[1] }}
      >
        <div className={styles.scroll__track}>
          <div className={styles.scroll__thumb}>
            <div className={styles.scroll__body}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
