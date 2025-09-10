import { ResponseError } from "../../constants";

type ScriptLayoutOptions = {
  action: () => Promise<unknown>;
};

export async function scriptLayout({ action }: ScriptLayoutOptions) {
  try {
    return await action();
  } catch (error) {
    if (error instanceof ResponseError) {
      return {
        message: error.message,
        status: error.status,
      };
    }

    throw error;
  }
}
