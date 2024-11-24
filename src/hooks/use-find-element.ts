import { useEffect, useState } from "react";

export function useFindElement(selector: () => Element | null) {
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  useEffect(() => {
    const checkAndSetTarget = () => {
      const target = selector();
      if (target) {
        setTargetElement(target);
      }
    };

    checkAndSetTarget();

    const observer = new MutationObserver(() => {
      checkAndSetTarget();
    });

    const clickHandler = () => {
      setTimeout(checkAndSetTarget, 100);
    };

    document.addEventListener("click", clickHandler);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      document.removeEventListener("click", clickHandler);
    };
  }, [selector]);

  return targetElement;
}
