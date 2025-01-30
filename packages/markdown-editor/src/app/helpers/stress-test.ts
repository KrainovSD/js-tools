import { FULL_EXAMPLE } from "./full-example";

export const STRESS_TEST = Array.from({ length: 4000 }, () => FULL_EXAMPLE).join("\n");
// export const STRESS_TEST = Array.from({ length: 50000 }, () => "### Content").join("\n");
