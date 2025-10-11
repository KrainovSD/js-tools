import { CheckBox } from "@krainovsd/react-ui";
import type { DefaultRow, HeaderRenderProps } from "../../types";
import { HeaderRenderWrapper } from "./wrappers";

type CheckProps = (props: {
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => React.ReactNode;
export type SelectHeaderRenderProps = {
  Check?: CheckProps;
};
export function SelectHeaderRender<RowData extends DefaultRow>(props: HeaderRenderProps<RowData>) {
  const headerRenderProps = props.context.column.columnDef.headerRenderProps as
    | SelectHeaderRenderProps
    | undefined;
  const Check = headerRenderProps?.Check ?? CheckBox;
  const checked = props.context.table.getIsAllPageRowsSelected();

  return (
    <HeaderRenderWrapper>
      <Check
        checked={checked}
        onChange={() => {
          props.context.table.toggleAllPageRowsSelected();
        }}
      />
    </HeaderRenderWrapper>
  );
}
