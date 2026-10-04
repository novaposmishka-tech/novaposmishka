"use client"

import { useSyncExternalStore } from "react"

/**
 * Which case study the works page is showing, if any — kept in the URL's
 * fragment rather than in state.
 *
 * The design switches the page between the grid of works and one case told
 * end to end: a direction's tab shows the grid, a case's chip shows the case
 * in its place. The fragment is that choice. It is what a chip's link already
 * sets, it survives a reload, it can be sent as a link, and the homepage can
 * open the listing straight on a case by pointing at it.
 */

const CASE = "case-"
const listeners = new Set<() => void>()

function read() {
  const hash = window.location.hash.slice(1)

  return hash.startsWith(CASE) ? hash : ""
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("hashchange", listener)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("hashchange", listener)
  }
}

/** The id of the case study chosen on this page, or "" for the grid. */
export function useChosenCase() {
  // Nothing on the server, and nothing on the first client render either, so
  // the markup hydrates against what the server sent before it switches.
  return useSyncExternalStore(subscribe, read, () => "")
}

/**
 * Back to the grid: takes the case out of the URL without adding a history
 * entry, so the back button still leaves the page rather than retracing tabs.
 * replaceState fires no hashchange, hence the listeners of our own.
 */
export function showGrid() {
  const { pathname, search } = window.location
  window.history.replaceState(window.history.state, "", pathname + search)
  for (const listener of listeners) listener()
}

/**
 * A case study on the works page: in the page, for a reader without script
 * and for a search engine, but shown only while it is the chosen one.
 */
export function CasePanel({
  id,
  children,
}: {
  readonly id: string
  readonly children: React.ReactNode
}) {
  const chosen = useChosenCase()

  return <div hidden={chosen !== id}>{children}</div>
}

export default CasePanel
