import { IS_BROWSER, IS_JEST } from "../../constants";

export function downloadJson(data: unknown, name: string) {
  if (!IS_BROWSER && !IS_JEST) return null;

  const url = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;

  const link = document.createElement("a");
  link.style.display = "none";
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  link.remove();
}
