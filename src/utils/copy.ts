export const copyToBuffer = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const input = document.createElement("input");
      input.style.position = "fixed";
      input.style.pointerEvents = "none";
      input.style.top = "0";
      input.style.left = "0";
      input.style.zIndex = "999999";
      input.style.opacity = "0";

      document.body.appendChild(input);
      input.value = text;
      input.select();
      document.execCommand("copy");
      input.remove();
      return true;
    } catch {
      return false;
    }
  }
};
