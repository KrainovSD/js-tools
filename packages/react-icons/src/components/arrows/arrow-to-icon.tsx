import type { IconProps } from "../../types";

export function ArrowTo(props: IconProps): React.JSX.Element {
  const { size = 14, sizeX = size, sizeY = size, color = "currentColor", style, ...rest } = props;

  return (
    <svg
      width={sizeX}
      height={sizeY}
      viewBox="0 0 20 20"
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
        d="M18.75 6.87514V11.8751C18.75 12.0409 18.6842 12.1999 18.5669 12.3171C18.4497 12.4343 18.2908 12.5001 18.125 12.5001H13.125C12.9592 12.5001 12.8003 12.4343 12.6831 12.3171C12.5658 12.1999 12.5 12.0409 12.5 11.8751C12.5 11.7094 12.5658 11.5504 12.6831 11.4332C12.8003 11.316 12.9592 11.2501 13.125 11.2501H16.6094L14.8625 9.51499C13.9011 8.55318 12.6761 7.89808 11.3424 7.63255C10.0087 7.36701 8.62625 7.50296 7.36983 8.02321C6.1134 8.54346 5.03948 9.42464 4.2839 10.5553C3.52831 11.6859 3.12501 13.0153 3.125 14.3751C3.125 14.5409 3.05915 14.6999 2.94194 14.8171C2.82473 14.9343 2.66576 15.0001 2.5 15.0001C2.33424 15.0001 2.17527 14.9343 2.05806 14.8171C1.94085 14.6999 1.875 14.5409 1.875 14.3751C1.87497 12.7682 2.35148 11.1972 3.24427 9.86106C4.13705 8.52489 5.40601 7.48346 6.89068 6.86849C8.37535 6.25352 10.009 6.09261 11.5851 6.40613C13.1613 6.71965 14.609 7.4935 15.7453 8.62983L17.5 10.3728V6.87514C17.5 6.70938 17.5658 6.55041 17.6831 6.4332C17.8003 6.31599 17.9592 6.25014 18.125 6.25014C18.2908 6.25014 18.4497 6.31599 18.5669 6.4332C18.6842 6.55041 18.75 6.70938 18.75 6.87514Z"
        fill={color}
      />
    </svg>
  );
}
