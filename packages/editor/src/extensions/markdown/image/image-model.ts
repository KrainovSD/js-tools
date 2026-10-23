export const NAME_OF_IMAGE = "Image";

export const CODE_OF_START_IMAGE_TEXT = 91; // [
export const CODE_OF_END_IMAGE_TEXT = 93; // ]
export const CODE_OF_START_IMAGE_URL = 40; // (
export const CODE_OF_END_IMAGE_URL = 41; // )

export type ImageEntry = {
  from: number;
  to: number;
  text: string;
  url: string;
};
