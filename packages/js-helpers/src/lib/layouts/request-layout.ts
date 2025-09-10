import { ResponseError } from "../../constants";

type RequestLayoutOptions<T> = {
  action: () => Promise<T>;
  setCode: (code: number) => void;
};

export async function requestLayout<T>({ action, setCode }: RequestLayoutOptions<T>) {
  try {
    return await action();
  } catch (error) {
    if (error instanceof ResponseError) {
      setCode(error.status);

      return {
        message: error.message,
      };
    }

    throw error;
  }
}
