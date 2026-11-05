import Script from "next/script"

import { AnalyticsClickTracker } from "@/components/providers/AnalyticsClickTracker"
import { getEnvVar } from "@/lib/env-vars"
import { isDevelopment } from "@/lib/general-helpers"

export function TrackingScriptWrapper({
  id,
  scriptContent,
  scriptOptions,
  ignoreInDevelopment = true,
}: {
  scriptContent: string
  id: string
  scriptOptions: Exclude<
    React.ComponentProps<typeof Script>,
    "id" | "dangerouslySetInnerHTML"
  >
  ignoreInDevelopment?: boolean
}) {
  if (ignoreInDevelopment && isDevelopment()) {
    return null
  }

  return (
    <Script
      id={id}
      dangerouslySetInnerHTML={{ __html: scriptContent }}
      {...scriptOptions}
    />
  )
}

/**
 * Google Tag Manager, where the site's analytics live: the GA4 tag and
 * whatever else is added later is configured in the container, not here.
 *
 * Loaded only where `GTM_ID` is set, and never in development, so a local
 * visit does not land in the clinic's reports.
 */
function GoogleTagManager() {
  const gtmId = getEnvVar("GTM_ID")

  if (!gtmId || isDevelopment()) {
    return null
  }

  return (
    <>
      <TrackingScriptWrapper
        id="google-tag-manager"
        scriptOptions={{ strategy: "afterInteractive" }}
        scriptContent={`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      />
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  )
}

function TrackingScripts() {
  return (
    <>
      <GoogleTagManager />
      <AnalyticsClickTracker />
    </>
  )
}

export default TrackingScripts
