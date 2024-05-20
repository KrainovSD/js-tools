export function logfmtGetter(
  obj: Record<string, unknown>,
  deniedProperties?: string[],
) {
  // FIXME: Убрать после отладки
  console.log(JSON.stringify(obj));

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
function isHasSpace(str: unknown) {
  return typeof str === 'string' && str.includes(' ');
}
