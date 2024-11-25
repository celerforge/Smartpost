/**
 * Custom error for X DOM operations
 */
export class XDOMError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "XDOMError";
  }
}

/**
 * Gets the editable text element from X's post composer
 * @throws {XDOMError} When text element cannot be found
 */
export function getXPostTextElement(
  required: boolean = true,
): HTMLElement | null {
  const element = document.querySelector<HTMLElement>('[data-text="true"]');
  if (!element && required) {
    throw new XDOMError("Post text element not found.");
  }
  return element;
}

/**
 * Updates the text content of an X post composer element
 * If element doesn't exist, creates one
 */
export function updateXPostText(newText: string): void {
  try {
    let element = getXPostTextElement(false);
    if (element?.tagName === "BR") {
      const newElement = document.createElement("span");
      newElement.setAttribute("data-text", "true");
      newElement.setAttribute("contenteditable", "true");
      element.replaceWith(newElement);
      element = newElement;
    }

    if (!element) {
      throw new XDOMError("Post text element not found.");
    }

    element.textContent = newText;
    element.click();
    element.dispatchEvent(new Event("input", { bubbles: true }));
  } catch (error) {
    if (error instanceof XDOMError) {
      throw error;
    }
    throw new XDOMError(`Failed to update X post: ${error.message}.`);
  }
}
