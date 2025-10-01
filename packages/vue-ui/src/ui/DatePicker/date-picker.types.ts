export type DatePickerDay = {
  id: number;
  date: Date;
  value: number;
  today: boolean;
  currentMonth: boolean;
  weekend: boolean;
};
export type DatePickerView = "days" | "months" | "years" | "decades";
export type DatePickerWeekDay = {
  weekend: boolean;
  value: number;
  label: string;
};
export type DatePickerSize = "default" | "large";
