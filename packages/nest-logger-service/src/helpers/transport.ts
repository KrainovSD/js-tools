import { format } from 'winston';

export const transportFormatLogfmt = format.printf((info) => {
  console.log(info);
  return getCorrectLog(info);
});
export const transportFormatJson = format.printf((info) => {
  console.log(info);
  return JSON.stringify(info);
});

function isHasSpace(str: string | null) {
  return typeof str === 'string' && str.includes(' ');
}
function getCorrectLog(
  obj: Record<string, string | null>,
  deniedProperties?: string[],
) {
  let log = '';
  // eslint-disable-next-line prefer-const
  for (let [key, value] of Object.entries(obj)) {
    if (
      (deniedProperties && deniedProperties.includes(key.toLowerCase())) ||
      typeof value === 'undefined'
    )
      continue;

    if (isHasSpace(value)) {
      value = `"${value}"`;
    }

    log += `${key}=${value} `;
  }

  return log.trim();
}
