import type { SVGProps } from "react"

/**
 * Google's mark, as the footer's rating badge shows it.
 *
 * Exported from the Figma file and left in Google's own four colours: a brand
 * logo recoloured to fit a palette stops being that brand's logo. The clip
 * path Figma emits is dropped — the artwork already fits the viewBox, and a
 * fixed clip id would collide if the badge appeared twice on a page.
 */
export function GoogleMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" fill="none" aria-hidden {...props}>
      <path
        d="M59.4165 24.1245H57V24H30V36H46.9545C44.481 42.9855 37.8345 48 30 48C20.0595 48 12 39.9405 12 30C12 20.0595 20.0595 12 30 12C34.5885 12 38.763 13.731 41.9415 16.5585L50.427 8.073C45.069 3.0795 37.902 0 30 0C13.4325 0 0 13.4325 0 30C0 46.5675 13.4325 60 30 60C46.5675 60 60 46.5675 60 30C60 27.9885 59.793 26.025 59.4165 24.1245Z"
        fill="#FFC107"
      />
      <path
        d="M3.45898 16.0365L13.3155 23.265C15.9825 16.662 22.4415 12 30 12C34.5885 12 38.763 13.731 41.9415 16.5585L50.427 8.073C45.069 3.0795 37.902 0 30 0C18.477 0 8.48398 6.5055 3.45898 16.0365Z"
        fill="#FF3D00"
      />
      <path
        d="M30 60.0001C37.749 60.0001 44.79 57.0346 50.1135 52.2121L40.8285 44.3551C37.7153 46.7226 33.9112 48.0032 30 48.0001C22.197 48.0001 15.5715 43.0246 13.0755 36.0811L3.29248 43.6186C8.25748 53.3341 18.3405 60.0001 30 60.0001Z"
        fill="#4CAF50"
      />
      <path
        d="M59.4165 24.1245H57V24H30V36H46.9545C45.7713 39.3246 43.64 42.2298 40.824 44.3565L40.8285 44.3535L50.1135 52.2105C49.4565 52.8075 60 45 60 30C60 27.9885 59.793 26.025 59.4165 24.1245Z"
        fill="#1976D2"
      />
    </svg>
  )
}

export default GoogleMark
