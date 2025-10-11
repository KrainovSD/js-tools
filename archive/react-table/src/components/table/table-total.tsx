import styles from "./table-total.module.scss";

type Props = {
  totalRows: number;
};

export function TableTotal(props: Props) {
  return <div className={styles.paginationTotal}>{`Всего: ${props.totalRows}`}</div>;
}
