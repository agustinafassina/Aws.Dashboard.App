import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => el.offsetParent !== null || el === document.activeElement)
}

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
  options?: {
    onEscape?: () => void
    initialFocus?: 'first' | 'container'
  },
) {
  const onEscapeRef = useRef(options?.onEscape)
  const initialFocusRef = useRef(options?.initialFocus)

  useEffect(() => {
    onEscapeRef.current = options?.onEscape
    initialFocusRef.current = options?.initialFocus
  })

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusables = getFocusableElements(container)

    if (initialFocusRef.current === 'first' && focusables[0]) {
      focusables[0].focus()
    } else if (initialFocusRef.current === 'container') {
      container.focus()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeRef.current?.()
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const items = getFocusableElements(container)
        if (items.length < 2) return

        event.preventDefault()
        const currentIndex = items.indexOf(
          document.activeElement as HTMLElement,
        )
        const delta = event.key === 'ArrowDown' ? 1 : -1
        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + delta + items.length) % items.length
        items[nextIndex]?.focus()
        return
      }

      if (event.key !== 'Tab') return

      const items = getFocusableElements(container)
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [active, containerRef])
}
