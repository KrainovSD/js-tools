export type DatePickerCell = {
  id: number;
  date: Date;
  value: number;
  label: string;
  today: boolean;
  noTarget: boolean;
  weekend: boolean;
};

export type DatePickerView = "days" | "months" | "years";
export type DatePickerLocalView = "days" | "months" | "years" | "decades";

export type DatePickerWeekDay = {
  weekend: boolean;
  value: number;
  label: string;
};
export type DatePickerSize = "default" | "large";
export type DatePickerDisplayFormat = "ru-dot" | "ru-slash" | "iso";
