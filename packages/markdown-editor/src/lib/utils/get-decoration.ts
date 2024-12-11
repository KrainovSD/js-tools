import { Decoration, type WidgetType } from "@codemirror/view";

type GetLineDecorationOptions = {
  style: string;
  range: [number, number?];
};
export function getLineDecoration({ style, range }: GetLineDecorationOptions) {
  return Decoration.line({
    class: style,
  }).range(range[0], range[1]);
}

type GetMarkDecorationOptions = {
  style: string;
  range: [number, number];
};
export function getMarkDecoration({ range, style }: GetMarkDecorationOptions) {
  return Decoration.mark({
    class: style,
  }).range(range[0], range[1]);
}

type GetHideDecorationOptions = {
  range: [number, number];
};
export function getHideDecoration({ range }: GetHideDecorationOptions) {
  return Decoration.replace({}).range(range[0], range[1]);
}

type GetReplaceDecorationOptions = {
  range: [number, number?];
  widget: WidgetType;
};
export function getReplaceDecoration({ range, widget }: GetReplaceDecorationOptions) {
  return Decoration.replace({ widget }).range(range[0], range[1]);
}

type GetWidgetDecorationOptions = {
  widget: WidgetType;
  range: [number, number?];
};
export function getWidgetDecorationOptions({ widget, range }: GetWidgetDecorationOptions) {
  return Decoration.widget({ widget, side: 1 }).range(range[0], range[1]);
}
