import { IS_BROWSER, IS_JEST } from "../../constants";
import { getFileNameFromHeader } from "../utils";

type DownloadFileOptions = {
  data: Blob;
  fileName: string;
  mimeType: string;
};

export function downloadFile({ data, fileName, mimeType }: DownloadFileOptions) {
  if (!IS_BROWSER && !IS_JEST) return null;

  const name = getFileNameFromHeader(fileName);
  if (!name) throw new Error("Bad filename");

  const blob = new Blob([data], {
    type: mimeType,
  });

  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.style.display = "none";
  link.download = name;
  link.href = downloadUrl;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return null;
}
