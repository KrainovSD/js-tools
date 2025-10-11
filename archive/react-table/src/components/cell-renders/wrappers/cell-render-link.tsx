import type { CellContext, DefaultRow } from "../../../types";

export type CellRenderLinkProps<RowData extends DefaultRow> = {
  Link?: (props: {
    children?: React.ReactNode;
    context: CellContext<RowData>;
  }) => React.ReactNode | null;
  context: CellContext<RowData>;
};

export function CellRenderLink<RowData extends DefaultRow>(
  props: React.PropsWithChildren<CellRenderLinkProps<RowData>>,
) {
  if (!props.Link) return props.children;

  return <props.Link context={props.context}>{props.children}</props.Link>;
}
