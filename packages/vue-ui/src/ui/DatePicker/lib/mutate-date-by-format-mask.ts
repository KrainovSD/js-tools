import type { DatePickerDisplayFormat, DatePickerView } from "../date-picker.types";

type MutateDateByFormatMaskOptions = {
  target: HTMLInputElement;
  displayFormat: DatePickerDisplayFormat;
  view: DatePickerView;
  delete: boolean;
  key: string;
  updateValue: (value: string) => void;
};
export function mutateDateByFormatMask(opts: MutateDateByFormatMaskOptions) {
  const initialValue = opts.target.value;
  let separator: string = ".";
  let length: number = 10;
  const separatorPositions: number[] = [];

  if (opts.displayFormat === "ru-dot") {
    separator = ".";
    separatorPositions.push(3);
    separatorPositions.push(6);
  } else if (opts.displayFormat === "ru-slash") {
    separator = "/";
    separatorPositions.push(3);
    separatorPositions.push(6);
  } else if (opts.displayFormat === "iso") {
    separator = "-";
    separatorPositions.push(5);
    separatorPositions.push(8);
  }

  if (opts.view === "days") {
    length = 10;
  } else if (opts.view === "months") {
    separatorPositions.pop();
    length = 7;
  } else if (opts.view === "years") {
    separatorPositions.pop();
    separatorPositions.pop();
    length = 4;
  }

  if (opts.delete) {
    const separatorIndex = separatorPositions.findIndex((p) => p === initialValue.length);
    if (separatorIndex === -1) {
      opts.target.value = initialValue.slice(0, initialValue.length - 1);
    } else {
      opts.target.value = initialValue.slice(0, separatorPositions[separatorIndex] - 2);
    }

    if (initialValue.length === separatorPositions[0]) {
      opts.target.value = initialValue.slice(0, separatorPositions[0] - 2);
    } else if (initialValue.length === separatorPositions[1]) {
      opts.target.value = initialValue.slice(0, separatorPositions[1] - 2);
    } else {
      opts.target.value = initialValue.slice(0, initialValue.length - 1);
    }
  } else if (initialValue.length < length) {
    const separatorIndex = separatorPositions.findIndex((p) => p === initialValue.length + 2);
    if (separatorIndex === -1) {
      opts.target.value += opts.key;
    } else {
      opts.target.value += `${opts.key}${separator}`;
    }
  }

  if (initialValue !== opts.target.value) {
    opts.updateValue(opts.target.value);
  }
}
