import { wait } from "./wait";

type AsyncLoopOptions = {
  syncOperations?: number;
  start?: number;
};
export async function asyncLoop(
  cb: (index: number) => void,
  length: number,
  { start = 0, syncOperations = 10000 }: AsyncLoopOptions = {},
) {
  let index = start;

  while (index < start + syncOperations && index < length) {
    cb(index);
    index++;
  }

  if (index < length) {
    await wait(0);

    return asyncLoop(cb, length, { start: index, syncOperations });
  }
}
