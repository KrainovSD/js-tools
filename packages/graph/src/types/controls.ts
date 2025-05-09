type GraphSettingsInputRange<I extends string> = {
  type: "range";
  min: number;
  max: number;
  step: number;
  initialValue: number;
  id: I;
  label: string;
};

type GraphSettingsInputCheckBox<I extends string> = {
  type: "checkbox";
  id: I;
  initialValue: boolean;
  label: string;
};

type GraphSettingsInputColorBox<I extends string> = {
  type: "color";
  id: I;
  initialValue: string;
  label: string;
};

type GraphSettingsInputSelect<I extends string> = {
  type: "select";
  id: I;
  initialValue: string;
  label: string;
  options: { label: string; value: string }[];
};

export type GraphSettingsInputInterface<I extends string> =
  | GraphSettingsInputRange<I>
  | GraphSettingsInputCheckBox<I>
  | GraphSettingsInputColorBox<I>
  | GraphSettingsInputSelect<I>;
