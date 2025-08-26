import clsx from "clsx";

export type HeaderRenderWrapperProps = {
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export function HeaderRenderWrapper(props: React.PropsWithChildren<HeaderRenderWrapperProps>) {
  const { className, ...rest } = props;

  return (
    <div {...rest} className={clsx("ksd-table-header-cell-container", className)}>
      {props.children}
    </div>
  );
}
