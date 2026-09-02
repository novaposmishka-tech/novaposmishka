"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
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
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}>) {
  const t = useTranslations("leadForm")

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

      toast.success(t("success"))
      form.reset()
    } catch (caught) {
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
      </AppForm>

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

        <Button
          type="submit"
          className="mx-auto mt-4 w-full md:w-fit"
          size="lg"
          form={leadFormName}
          isLoading={form.formState.isSubmitting}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  )
}

const LeadFormSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(6),
  company: z.string().optional(),
})

type FormSchemaType = typeof LeadFormSchema

export const leadFormName = "leadForm"
