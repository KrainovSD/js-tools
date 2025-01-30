import type { Ajv } from "ajv";

export function ajvFilePlugin(ajv: Ajv) {
  ajv.addKeyword({
    keyword: "isFile",
    compile: (_schema: unknown, parent: Record<string, unknown>) => {
      // Updates the schema to match the file type
      parent.type = "file";
      delete parent.isFile;

      return (field /* MultipartFile */) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return !!field.file;
      };
    },
    error: {
      message: "should be a file",
    },
  });

  return ajv;
}
