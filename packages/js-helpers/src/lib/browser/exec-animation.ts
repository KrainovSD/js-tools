import { IS_BROWSER, IS_JEST } from "../../constants";

export function execAnimation(
  element: HTMLElement | null | undefined,
  className: string,
  autoCloseDelay: number = 700,
) {
  return new Promise((resolve) => {
    if (!IS_BROWSER && !IS_JEST) {
      resolve(true);

      return;
    }

    if (!element) {
      resolve(true);

      return;
    }

    const timerId = setTimeout(() => {
      resolve(true);
    }, autoCloseDelay);

    element.addEventListener(
      "animationend",
      () => {
        resolve(true);
        element?.classList?.remove?.(className);
        clearTimeout(timerId);
      },
      {
        once: true,
      },
    );
    element.classList.add(className);
  });
}
