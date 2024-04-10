import set from 'lodash/set';
import cloneDeep from 'lodash/cloneDeep';
import getByPath from 'lodash/get';
import shuffle from 'lodash/shuffle';
import { Maybe } from '../types';
import typings from '../typings';

function get(
  object: Maybe<Record<string, any>>,
  path: Maybe<string>,
  defaultValue: any = null,
) {
  if (!typings.isObject(object) || !typings.isString(path)) return defaultValue;

  return getByPath(object, path, defaultValue);
}

export default { get, set, cloneDeep, shuffle };
