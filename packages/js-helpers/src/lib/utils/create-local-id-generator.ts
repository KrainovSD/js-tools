import { createGlobalId } from "./create-global-id";

export function createLocalIdGenerator(): () => number {
  let localLastId = 0;
  const globalLastId = createGlobalId() << 14;

  return function generateId() {
    return (globalLastId | localLastId++) >>> 0;
  };
}
