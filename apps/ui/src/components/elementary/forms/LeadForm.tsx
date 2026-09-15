"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useSyncExternalStore } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import AppLink from "@/components/elementary/AppLink"
import { AppField } from "@/components/forms/AppField"
import { AppForm } from "@/components/forms/AppForm"
import { Button } from "@/components/ui/button"
import { readError } from "@/lib/http"
import { cn } from "@/lib/styles"

/**
 * Posts to /API/lead, which forwards the request to Telegram and stores it in
 * Strapi. The form never talks to Strapi directly — the bot token and the API
 * token both stay server-side.
 */
export function LeadForm({
  gdpr,
  onStatusChange,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
  /** The block around the form shows the outcome; see LeadFormBlock. */
  onStatusChange?: (status: "idle" | "sent" | "failed") => void
}>) {
  const t = useTranslations("leadForm")

  // Until React has taken over the form, a submit button is just a button the
  // browser acts on itself — which navigates away with the phone number in the
  // query string and loses the lead. Inert until then.
  //
  // useSyncExternalStore rather than an effect: it reads false on the server
  // and true on the client with no extra state write, which is exactly the
  // question being asked.
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(LeadFormSchema),
    mode: "onBlur",
    reValidateMode: "onSubmit",
    defaultValues: { name: "", phone: "", company: "" },
  })

  const onSubmit = async (values: z.infer<FormSchemaType>) => {
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const body = await readError(response)
        throw new Error(body.error ?? t("error"))
      }

      form.reset()
      onStatusChange?.("sent")
    } catch (caught) {
      onStatusChange?.("failed")
      toast.error(caught instanceof Error ? caught.message : t("error"))
    }
  }

  return (
    <div className="flex w-full flex-col">
      <AppForm
        form={form}
        onSubmit={onSubmit}
        id={leadFormName}
        // The frame gives this form its own shape, and it is the only one that
        // sits on the dark card: a 54px pill on white at a tenth of a twentieth,
        // its label above it in the card's own ink. Scoped here rather than in
        // the shared field, which every light form on the site still uses.
        className={cn(
          "w-full [&_fieldset]:space-y-7.5",
          "[&_label]:text-brand-inverted [&_label]:text-sm/5 [&_label]:font-normal lg:[&_label]:text-base/5.5",
          // A hairline of teal once the field is being used, as the frame
          // draws a field that has something in it — transparent otherwise, so
          // the pill keeps its height either way.
          "[&_input]:text-brand-inverted [&_input]:h-12.5 [&_input]:rounded-[60px] [&_input]:border [&_input]:border-transparent [&_input]:bg-white/5 [&_input]:px-3.75 [&_input]:text-sm/5 lg:[&_input]:h-13.5 lg:[&_input]:text-lg/6.25",
          "[&_input:focus]:border-brand-teal [&_input:not(:placeholder-shown)]:border-brand-teal",
          // The shared field halos itself on focus with a 3px ring, which on
          // this dark card reads as a pale smear around the pill. The frame
          // marks a field in use with the hairline above and nothing else, and
          // that hairline is what shows the focus.
          "[&_input]:shadow-none [&_input:focus-visible]:ring-0",
          "[&_input]:placeholder:text-brand-muted"
        )}
      >
        <AppField
          name="name"
          type="text"
          autoComplete="name"
          label={t("name")}
          placeholder={t("namePlaceholder")}
          containerClassName="gap-2.5"
        />
        <AppField
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          label={t("phone")}
          placeholder={t("phonePlaceholder")}
          containerClassName="gap-2.5"
        />

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute left-[-9999px] size-0 opacity-0"
          {...form.register("company")}
        />

        {/* The frame leaves 50 between the last field and the button. */}
        <div className="mt-12.5! flex w-full flex-col gap-4">
          {gdpr?.href && (
            <div className="mt-5 flex flex-col items-center sm:flex-row">
              <p>{t("gdpr")}</p>
              <AppLink
                openInNewTab={gdpr.newTab}
                className="text-brand-teal p-0 pl-1 font-medium underline"
                href={gdpr.href}
              >
                {gdpr.label || t("gdprLink")}
              </AppLink>
            </div>
          )}

          {/* Inside the form, not linked to it by a `form` attribute: with the
              button outside, Firefox and WebKit submitted natively and
              navigated away with the phone number in the query string instead
              of posting it. Chromium happened to work, which is why it went
              unnoticed.

              The form always sits on the dark brand gradient, whose last stop
              is the same colour as the primary button — a default button would
              go invisible against the bottom of the card. Secondary inverts it. */}
          <Button
            type={hydrated ? "submit" : "button"}
            variant="secondary"
            // White, with the label in ink and the arrow after it — the frame's
            // button for the dark card.
            // White with the label in ink, turning teal under the pointer —
            // the frame's pair for a button on the dark card.
            className="text-brand-ink hover:bg-brand-teal hover:text-brand-inverted h-10.5 w-full gap-2 rounded-[30px] bg-white px-5 text-base/5.5 font-semibold lg:h-12.5 lg:w-fit lg:px-7.5"
            isLoading={form.formState.isSubmitting}
            data-hydrated={hydrated || undefined}
          >
            {t("submit")}
            <ArrowRight aria-hidden className="size-5" />
          </Button>
        </div>
      </AppForm>
    </div>
  )
}

/** The value never changes after mount, so there is nothing to subscribe to. */
const unsubscribe = () => {}
const subscribeToNothing = () => unsubscribe

const LeadFormSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(6),
  company: z.string().optional(),
})

type FormSchemaType = typeof LeadFormSchema

export const leadFormName = "leadForm"
