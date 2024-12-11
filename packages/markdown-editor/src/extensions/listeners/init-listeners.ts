import { type GetChangeEventOptions, getChangeEvent } from "./get-change-event";
import { type GetFocusEventOptions, getFocusEvent } from "./get-focus-event";

export type InitListenersOptions = GetFocusEventOptions & GetChangeEventOptions;

export function initListeners({ onBlur, onChange, onFocus }: InitListenersOptions) {
  return [getChangeEvent({ onChange }), getFocusEvent({ onBlur, onFocus })];
}
