import { IS_BROWSER } from "../../constants";

export function readFile(file: File) {
  return new Promise((resolve) => {
    if (!IS_BROWSER) {
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
