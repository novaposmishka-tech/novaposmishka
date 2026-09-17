import { StaticImage } from "@/components/elementary/images/StaticImage"

/**
 * The shape the frame gives both error pages: an illustration of the code, the
 * line that says what happened, a line that says what it means, and the way
 * out underneath.
 *
 * The frame draws the two pages identically apart from the picture, the words
 * and the number of buttons, so they share this and differ only in what they
 * pass. It carries no header and no footer, as the frame does — the buttons
 * are the whole of the navigation offered here, which is why they are the
 * page's one job.
 */
export function ErrorPage({
  illustration,
  title,
  description,
  children,
}: {
  readonly illustration: { src: string; alt: string }
  readonly title: string
  readonly description: string
  /** The frame's buttons; see ERROR_ACTION for the two it draws. */
  readonly children: React.ReactNode
}) {
  return (
    // A marker the layout watches, so the header and footer stay off these
    // pages. `main` rather than a div: it makes this the page's one landmark,
    // which the heading below then belongs to.
    <main
      data-error-page
      className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
    >
      {/* Drawn at 650 by 325 on a desktop and 280 by 140 on a phone — the same
          two-to-one either way. The file is twice the larger of those, which
          is what a dense screen asks for. */}
      <StaticImage
        src={illustration.src}
        alt={illustration.alt}
        width={1300}
        height={650}
        priority
        className="h-auto w-70 lg:w-162.5"
      />

      {/* The design system gives every h1 its own size, weight and margin;
          the frame sets 26/31 on a phone and 40/48 at desktop, both regular. */}
      <h1 className="text-brand-ink mt-5 mb-0! text-[1.625rem]/[1.9375rem]! font-normal! lg:mt-7.5 lg:text-[2.5rem]/12!">
        {title}
      </h1>

      <p className="text-brand-body mt-5 max-w-71.75 text-base/5.5 lg:max-w-133 lg:text-lg/6.25">
        {description}
      </p>

      {/* Stacked on a phone and side by side at desktop, as the frame has
          them. A single button takes the same row and simply fills it. */}
      <div className="mt-12.5 flex w-full max-w-80 flex-col gap-7.5 lg:mt-10 lg:w-auto lg:max-w-none lg:flex-row lg:gap-5">
        {children}
      </div>
    </main>
  )
}

/** The frame's filled button: the gradient, going flat teal under a pointer. */
export const ERROR_ACTION_PRIMARY =
  "bg-brand-gradient shadow-brand-button text-brand-inverted hover:bg-brand-teal flex h-10.5 w-full cursor-pointer items-center justify-center gap-1.5 rounded-[30px] text-base/5.5 font-semibold transition-colors hover:bg-none lg:h-12.5 lg:w-72.5"

/** Its outlined pair, which the frame gives no arrow. */
export const ERROR_ACTION_SECONDARY =
  "border-brand-teal text-brand-ink hover:bg-brand-gradient hover:text-brand-inverted flex h-10.5 w-full cursor-pointer items-center justify-center rounded-[30px] border bg-transparent text-sm/5 font-semibold transition-colors hover:border-transparent lg:h-12.5 lg:w-54.25 lg:text-base/5.5"

export default ErrorPage
