export function copyToClipboard(content: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(content);
  }

  return fallbackCopyTextToClipboard(content);
}

function fallbackCopyTextToClipboard(content: string) {
  const textArea = document.createElement("textarea");
  textArea.value = content;

  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.opacity = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  return new Promise<void>((resolve, reject) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      if (document.execCommand("copy")) resolve();
      else reject();
    } catch {
      reject();
    } finally {
      document.body.removeChild(textArea);
    }
  });
}
