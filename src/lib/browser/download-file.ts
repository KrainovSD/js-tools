import { IS_BROWSER } from "../../constants";

type DownloadFileOptions = {
  data: Blob;
  fileName: string;
  mimeType: string;
};

const filenameVariables = ["filename=", "filename*=UTF-8''"];

export function downloadFile({ data, fileName, mimeType }: DownloadFileOptions) {
  if (!IS_BROWSER) return null;

  const name = fileName
    .split(";")
    .find((info) => ~info.indexOf(filenameVariables[0]) || ~info.indexOf(filenameVariables[1]))
    ?.replace(filenameVariables[0], "")
    ?.replace(filenameVariables[1], "")
    ?.replace(/"/g, "")
    ?.trim();
  if (!name) throw new Error("Bad filename");

  const blob = new Blob([data], {
    type: mimeType,
  });
  if (!blob) throw new Error("Bad data");

  const downloadUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.style.display = "none";
  link.download = decodeURI(name);
  link.href = downloadUrl;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return null;
}
