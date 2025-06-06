import type { IconProps } from "../../types";

export function SendingArrowLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fontSize: sizeY == undefined ? undefined : `${sizeY}px`,
        width: sizeX == undefined ? undefined : `${sizeX}px`,
        height: sizeY == undefined ? undefined : `${sizeY}px`,
        minWidth: sizeX == undefined ? undefined : `${sizeX}px`,
        minHeight: sizeY == undefined ? undefined : `${sizeY}px`,
        maxWidth: sizeX == undefined ? undefined : `${sizeX}px`,
        maxHeight: sizeY == undefined ? undefined : `${sizeY}px`,
        ...style,
      }}
      {...rest}
    >
      <path
        d="M16.7104 8.27341L11.0854 13.8984C11.0068 13.9772 10.9065 14.0308 10.7973 14.0526C10.6881 14.0743 10.575 14.0632 10.4721 14.0205C10.3693 13.9779 10.2814 13.9058 10.2196 13.8132C10.1578 13.7206 10.1249 13.6118 10.125 13.5004V10.7041C6.11011 10.9319 3.35738 13.5356 2.58464 14.3604C2.46331 14.4899 2.30419 14.578 2.12993 14.6119C1.95568 14.6458 1.77517 14.6239 1.61409 14.5493C1.45301 14.4746 1.31957 14.3511 1.23276 14.1963C1.14595 14.0414 1.1102 13.8631 1.13058 13.6868C1.39144 11.4185 2.63386 9.23669 4.62933 7.54357C6.2866 6.13732 8.30105 5.24505 10.125 5.08896V2.25044C10.1249 2.13913 10.1578 2.03029 10.2196 1.9377C10.2814 1.84512 10.3693 1.77295 10.4721 1.73034C10.575 1.68773 10.6881 1.67659 10.7973 1.69833C10.9065 1.72007 11.0068 1.77372 11.0854 1.85247L16.7104 7.47747C16.7627 7.52972 16.8042 7.59175 16.8325 7.66004C16.8608 7.72833 16.8754 7.80152 16.8754 7.87544C16.8754 7.94936 16.8608 8.02256 16.8325 8.09085C16.8042 8.15913 16.7627 8.22117 16.7104 8.27341Z"
        fill={color}
      />
    </svg>
  );
}
