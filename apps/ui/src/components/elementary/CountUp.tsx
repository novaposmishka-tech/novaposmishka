"use client"

import { useEffect, useRef } from "react"

/** How long a figure takes to reach its value, in milliseconds. */
const DURATION = 1400

/**
 * A figure that counts up to its value when it scrolls into view.
 *
 * The page carries the finished number from the start — it is what a search
 * engine reads and what a reader without script sees — and the count only
 * runs over it once, on the client, when the figure is in view. The decimals
 * are kept as written, so "4.8" counts in tenths and "20" in whole numbers.
 * A reader who asked for less motion gets the number standing still.
 */
export function CountUp({ value }: { readonly value: number }) {
  const node = useRef<HTMLSpanElement>(null)
  const text = String(value)

  useEffect(() => {
    const element = node.current
    if (!element) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const decimals = (text.split(".", 2)[1] ?? "").length
    let frame = 0

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        observer.disconnect()

        // Hold the finished number's width while the shorter ones count up
        // through it, so the words after it do not shuffle.
        element.style.minWidth = `${element.getBoundingClientRect().width}px`
        element.style.display = "inline-block"

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1)
          // Fast at first and settling at the end, as a dial would.
          const eased = 1 - Math.pow(1 - progress, 3)
          element.textContent = (value * eased).toFixed(decimals)
          if (progress < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )
    observer.observe(element)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, text])

  return (
    <span ref={node} className="tabular-nums">
      {text}
    </span>
  )
}

export default CountUp
