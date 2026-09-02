import "server-only"

import type { Data } from "@repo/strapi-types"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Typography from "@/components/typography"
import type { PageBuilderComponentProps } from "@/types/general"

export function StrapiTestimonials({
  component,
}: PageBuilderComponentProps & {
  component: Data.Component<"sections.testimonials">
}) {
  const { title, testimonials } = component

  if (!testimonials?.length) {
    return null
  }

  return (
    <section id="testimonials" className="scroll-mt-24">
      <Container className="flex flex-col gap-10">
        {title && (
          <Typography tag="h2" className="text-brand-ink max-w-2xl">
            {title}
          </Typography>
        )}

        <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className="border-brand-border flex flex-col gap-6 rounded-3xl border p-8"
            >
              <Typography className="text-brand-ink-soft text-xl">
                {/* Curly quotes belong to the design, not the CMS copy. */}
                &laquo;{testimonial.quote}&raquo;
              </Typography>

              <div className="mt-auto flex items-center gap-4">
                {testimonial.photo && (
                  <StrapiBasicImage
                    component={testimonial.photo}
                    width={56}
                    height={56}
                    className="size-14 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-brand-ink font-semibold">
                    {testimonial.authorName}
                  </span>
                  {testimonial.authorNote && (
                    <span className="text-brand-body text-sm">
                      {testimonial.authorNote}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

StrapiTestimonials.displayName = "StrapiTestimonials"

export default StrapiTestimonials
