export function getWatchedNode(watcher: HTMLElement | undefined | null) {
  let watchedNode = watcher;

  while (watchedNode) {
    watchedNode = watchedNode.nextElementSibling as HTMLElement | undefined;
    if (watchedNode == undefined) {
      break;
    } else if (watchedNode.hasAttribute("ksd-watcher")) {
      continue;
    }

    break;
  }

  return watchedNode;
}
