import { nanoid } from 'nanoid';
import typings from '../typings';
import _ from '../underscore';

function checkIrregularVerb(word: string) {
  const splitWord = word
    .split('--')
    .filter((item) => typings.isString(item) && item.length > 0);
  if (splitWord.length === 3) return true;
  return false;
}

function updateNewValue(
  oldObj: Record<string, unknown>,
  newObj: Record<string, unknown>,
  exception: string[] = [],
) {
  for (const field in newObj) {
    if (exception.includes(field)) continue;
    const oldValue = _.get(oldObj, field, undefined);
    const newValue = _.get(newObj, field, undefined);
    if (typings.isUndefined(oldValue) || typings.isUndefined(newValue))
      continue;
    if (oldValue === newValue) continue;
    _.set(oldObj, field, newValue);
  }
}

function getRandomId(size?: number) {
  return nanoid(size);
}

function safeJsonParse<T = unknown>(value: unknown) {
  try {
    if (!typings.isString(value)) return null;
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getRandomNumber(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export default {
  checkIrregularVerb,
  updateNewValue,
  getRandomId,
  safeJsonParse,
  getRandomNumber,
};
