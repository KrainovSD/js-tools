export function joinPaths(...parts: string[]) {
  return parts
    .reduce((result: string[], part) => {
      const trimedPart = part.trim().replace(/^\/+|\/+$/g, "");
      if (trimedPart.length > 0) result.push(trimedPart);

      return result;
    }, [])
    .join("/");
}
