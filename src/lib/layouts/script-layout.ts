import { ResponseError } from "../api";

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

    if (error instanceof Error) {
      return { errorName: error.name, errorMessage: error.message, errorStack: error.stack };
    }

    throw error;
  }
}
