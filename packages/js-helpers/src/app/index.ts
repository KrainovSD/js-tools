/* eslint-disable no-console */
import { randomBase64, randomHex, randomNumber, randomString, speedTest } from "../lib";

const numberMap: Record<string, number> = {};
const number2Map: Record<string, number> = {};

const bigNumberMap: Record<string, number> = {};
const hexMap: Record<string, number> = {};
const base64Map: Record<string, number> = {};
const stringMap: Record<string, number> = {};

const ITERATIONS = 1000000;
speedTest(
  () => {
    const v = randomNumber();
    numberMap[v] ??= 0;
    numberMap[v]++;
  },
  { name: "randomNumber", iterations: ITERATIONS, type: "performance" },
);

speedTest(
  () => {
    const v = randomString();
    stringMap[v] ??= 0;
    stringMap[v]++;
  },
  { name: "randomString", iterations: ITERATIONS, type: "performance" },
);
speedTest(
  () => {
    const v = randomHex();
    hexMap[v] ??= 0;
    hexMap[v]++;
  },
  { name: "randomHex", iterations: ITERATIONS, type: "performance" },
);

speedTest(
  () => {
    const v = randomBase64();
    base64Map[v] ??= 0;
    base64Map[v]++;
  },
  { name: "randomBase64", iterations: ITERATIONS, type: "performance" },
);

const number = randomNumber();
const hex = randomHex();
const base64 = randomBase64();
const string = randomString();

console.log({
  number: [number],
  hex: [hex, hex.length],
  base64: [base64, base64.length],
  string: [string, string.length],
});
console.log({
  numberRepeat: Object.entries(numberMap).filter(([, count]) => count > 1),
  number2Repeat: Object.entries(number2Map).filter(([, count]) => count > 1),
  bigNumberRepeat: Object.entries(bigNumberMap).filter(([, count]) => count > 1),
  stringRepeat: Object.entries(stringMap).filter(([, count]) => count > 1),
  hexRepeat: Object.entries(hexMap).filter(([, count]) => count > 1),
  base64Repeat: Object.entries(base64Map).filter(([, count]) => count > 1),
});
