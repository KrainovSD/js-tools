const filenameVariables = ["filename=", "filename*=UTF-8''"];

export function getFileNameFromHeader(header: string) {
  const name = header
    .split(";")
    .find((info) => ~info.indexOf(filenameVariables[0]) || ~info.indexOf(filenameVariables[1]))
    ?.replace(filenameVariables[0], "")
    ?.replace(filenameVariables[1], "")
    ?.replace(/"/g, "")
    ?.trim();

  return name ? decodeURI(name) : null;
}
