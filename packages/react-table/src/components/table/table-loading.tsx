import { Spinner } from "@krainovsd/react-ui";
import styles from "./table-loading.module.scss";

export function TableLoading() {
  return (
    <>
      <div className={styles.base}></div>
      <div className={styles.spin}>
        <Spinner />
      </div>
    </>
  );
}
