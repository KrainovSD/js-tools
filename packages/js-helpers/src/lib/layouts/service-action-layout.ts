import { ResponseError } from "../api";

export async function serviceActionLayout<T = unknown>(
  action: () => Promise<T>,
): Promise<
  | { data: T; status: 200; success: true }
  | { data: { message: string }; status: number; success: false }
> {
  try {
    const result = await action();

    return {
      data: result,
      status: 200,
      success: true,
    };
  } catch (error) {
    if (error instanceof ResponseError) {
      return { data: { message: error.message }, status: error.status, success: false };
    }

    throw error;
  }
}
