import { dirname as dirnamePath } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

export const dirname = dirnamePath(__filename);
