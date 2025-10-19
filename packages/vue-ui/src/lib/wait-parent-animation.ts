import { wait } from "@krainovsd/js-helpers";

export function waitParentAnimation(target: HTMLElement, maxWait: number = 3000) {
  return new Promise((resolve) => {
    let parent = target.parentElement;
    const controller = new AbortController();

    let animatingParent: HTMLElement | null = null;
    while (parent != undefined) {
      const styles = window.getComputedStyle(parent);
      if (styles.animationName != "none") {
        animatingParent = parent;
        break;
      }

      parent = parent.parentElement;
    }

    if (!animatingParent) {
      resolve(true);
      controller.abort();
    }

    document.addEventListener(
      "animationend",
      (event) => {
        if (animatingParent === event.target) {
          resolve(true);
          controller.abort();
        }
      },
      { signal: controller.signal },
    );
    void wait(maxWait).then(() => {
      resolve(true);
      controller.abort();
    });
  });
}
