import { useEffect, useState } from "react"

export function useToolbarTarget() {
  const [targetElement, setTargetElement] = useState<Element | null>(null)

  useEffect(() => {
    const checkAndSetTarget = () => {
      const toolBar = document.querySelector('div[data-testid="toolBar"]')
      const target = toolBar?.querySelector(
        'div[data-testid="ScrollSnap-List"]'
      )

      const buttonExists =
        target?.querySelectorAll("button").length > 0 &&
        Array.from(target.querySelectorAll("button")).some(
          (btn) => btn.textContent === "Custom button"
        )

      if (target && !buttonExists) {
        setTargetElement(target)
      }
    }

    checkAndSetTarget()

    const observer = new MutationObserver(() => {
      checkAndSetTarget()
    })

    const clickHandler = () => {
      setTimeout(checkAndSetTarget, 100)
    }

    document.addEventListener("click", clickHandler)

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
      document.removeEventListener("click", clickHandler)
    }
  }, [])

  return targetElement
}
