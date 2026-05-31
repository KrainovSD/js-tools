/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DeepReadonly, Ref, ShallowRef, UnwrapNestedRefs, UnwrapRef } from "vue";

type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
export type GenericReadonlyRef<T> = DeepReadonly<
  UnwrapNestedRefs<
    [T] extends [Ref<any, any>] ? IfAny<T, Ref<T, T>, T> : Ref<UnwrapRef<T>, T | UnwrapRef<T>>
  >
>;
export type GenericReadonlyShallowRef<T> = DeepReadonly<
  UnwrapNestedRefs<
    Ref<any, any> extends T
      ? T extends T & Ref<any, any>
        ? IfAny<T, ShallowRef<T, T>, T>
        : ShallowRef<T, T>
      : ShallowRef<T, T>
  >
>;
export type GenericRef<T> = [T] extends [Ref<any, any>]
  ? IfAny<T, Ref<T, T>, T>
  : Ref<UnwrapRef<T>, T | UnwrapRef<T>>;
export type GeneticShallowRef<T> =
  Ref<any, any> extends T
    ? T extends T & Ref<any, any>
      ? IfAny<T, ShallowRef<T, T>, T>
      : ShallowRef<T, T>
    : ShallowRef<T, T>;
