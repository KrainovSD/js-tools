import type { FIELD_TYPES } from "../constants";
import type { ValueOf } from "./common";

export type FieldType = ValueOf<typeof FIELD_TYPES>;
