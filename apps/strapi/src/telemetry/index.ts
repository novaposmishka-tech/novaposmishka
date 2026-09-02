import type { TelemetryProvider } from "./types"
import { logError, logger } from "../utils/logging"

export type { TelemetryProvider } from "./types"

/**
 * Initializes every configured telemetry target. Add providers to this list;
 * each one stays inert until its environment variables are set, so Strapi logs
 * to stdout by default and ships to a backend only when configured.
 *
 * There are currently no providers, so this is a no-op — the scaffold is kept
 * for whichever backend gets added later. Logs still go to stdout via pino.
 *
 * Run this as early as possible at process startup (see `src/instrumentation.ts`)
 * so backend exporters can instrument modules before the server starts.
 */
export function initializeTelemetry(): void {
  const providers: TelemetryProvider[] = []

  // Telemetry is best-effort: a misconfigured provider must not crash startup,
  // so isolate each provider and continue past failures.
  // The list is empty until a backend is added — that is the point of the
  // scaffold, so the "always empty" warning is expected here.
  // eslint-disable-next-line sonarjs/no-empty-collection
  for (const provider of providers) {
    try {
      provider.initialize()
      logger.info("Telemetry provider initialized", { provider: provider.name })
    } catch (error) {
      logError(error, "Telemetry provider failed to initialize", {
        provider: provider.name,
      })
    }
  }
}
