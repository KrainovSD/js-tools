import type { IconProps } from "../../types";

export function ContactsFilledLegacy(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeX}
      height={sizeY}
      viewBox="0 0 16 16"
      fill="none"
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
        d="M14.5 3.5H12V2.625C12 2.55625 11.9438 2.5 11.875 2.5H11C10.9312 2.5 10.875 2.55625 10.875 2.625V3.5H8.5625V2.625C8.5625 2.55625 8.50625 2.5 8.4375 2.5H7.5625C7.49375 2.5 7.4375 2.55625 7.4375 2.625V3.5H5.125V2.625C5.125 2.55625 5.06875 2.5 5 2.5H4.125C4.05625 2.5 4 2.55625 4 2.625V3.5H1.5C1.22344 3.5 1 3.72344 1 4V13C1 13.2766 1.22344 13.5 1.5 13.5H14.5C14.7766 13.5 15 13.2766 15 13V4C15 3.72344 14.7766 3.5 14.5 3.5ZM10.3281 11.5H9.64219C9.57656 11.5 9.52344 11.4484 9.51875 11.3828C9.45938 10.5922 8.8 9.96875 8 9.96875C7.2 9.96875 6.54062 10.5938 6.48125 11.3828C6.47656 11.4484 6.42344 11.5 6.35781 11.5H5.67188C5.65492 11.5 5.63814 11.4966 5.62255 11.4899C5.60696 11.4833 5.59289 11.4735 5.5812 11.4612C5.56951 11.4489 5.56044 11.4344 5.55453 11.4185C5.54863 11.4026 5.54603 11.3857 5.54688 11.3687C5.59062 10.5359 6.04688 9.81094 6.7125 9.39844C6.41897 9.07577 6.25677 8.65496 6.25781 8.21875C6.25781 7.25156 7.0375 6.46875 7.99844 6.46875C8.95937 6.46875 9.73906 7.25156 9.73906 8.21875C9.73906 8.67344 9.56719 9.08594 9.28438 9.39844C9.95156 9.8125 10.4062 10.5359 10.45 11.3687C10.4563 11.4406 10.4 11.5 10.3281 11.5ZM8 7.40625C7.55469 7.40625 7.19219 7.77031 7.19219 8.21875C7.19219 8.66719 7.55469 9.03125 8 9.03125C8.44531 9.03125 8.80781 8.66719 8.80781 8.21875C8.80781 7.77031 8.44531 7.40625 8 7.40625Z"
        fill={color}
      />
    </svg>
  );
}
