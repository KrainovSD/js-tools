import { Empty } from "antd";
import styles from "./table-empty.module.scss";

export function TableEmpty() {
  return (
    <Empty
      className={styles.base}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={"Нет данных"}
    />
  );
}
