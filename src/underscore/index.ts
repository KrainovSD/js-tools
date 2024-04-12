import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import getByPath from 'lodash/get';
import shuffle from 'lodash/shuffle';
import { Maybe } from '../types';
import typings from '../typings';

function get(
  object: Maybe<Record<string, unknown>>,
  path: Maybe<string>,
  defaultValue: unknown = null,
) {
  if (!typings.isObject(object) || !typings.isString(path)) return defaultValue;

  return getByPath(object, path, defaultValue);
}

export default { get, set, cloneDeep, shuffle };