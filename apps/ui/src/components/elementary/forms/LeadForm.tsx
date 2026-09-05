"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
        className="w-full"
      >
        <AppField
          name="name"
          type="text"
          autoComplete="name"
          label={t("name")}
          placeholder={t("namePlaceholder")}
        />
        <AppField
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          label={t("phone")}
          placeholder={t("phonePlaceholder")}
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

        <div className="flex w-full flex-col gap-4">
          {gdpr?.href && (
            <div className="mt-5 flex flex-col items-center sm:flex-row">
              <p>{t("gdpr")}</p>
              <AppLink
                openInNewTab={gdpr.newTab}
                className="p-0 pl-1 font-medium"
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
            className="mx-auto mt-4 w-full md:w-fit"
            size="lg"
            isLoading={form.formState.isSubmitting}
            data-hydrated={hydrated || undefined}
          >
            {t("submit")}
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
