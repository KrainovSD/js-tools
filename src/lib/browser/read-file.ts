import { IS_BROWSER, IS_JEST } from "../../constants";

export function readFile(file: File) {
  return new Promise((resolve) => {
    if (!IS_BROWSER && !IS_JEST) {
      resolve(null);

      return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      resolve(null);
    };
  });
}
