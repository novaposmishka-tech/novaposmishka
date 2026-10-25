/**
 * When the clinic answers the phone, in Kyiv time whatever the visitor's own
 * clock says: Mon–Fri 8:00–20:00, Sat 9:00–15:00, closed on Sunday.
 *
 * It is the schedule the footer prints. The footer's copy is free text an
 * editor writes for people to read, so it is kept here as data rather than
 * parsed out of that.
 */
const CLINIC_TIME_ZONE = "Europe/Kyiv"

/** Opening and closing minute of the day, by weekday (0 is Sunday). */
const SCHEDULE: Partial<Record<number, readonly [number, number]>> = {
  1: [8 * 60, 20 * 60],
  2: [8 * 60, 20 * 60],
  3: [8 * 60, 20 * 60],
  4: [8 * 60, 20 * 60],
  5: [8 * 60, 20 * 60],
  6: [9 * 60, 15 * 60],
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const kyivClock = new Intl.DateTimeFormat("en-US", {
  timeZone: CLINIC_TIME_ZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

/** Whether someone is at the clinic to pick up the phone at `date`. */
export function isClinicOpen(date: Date): boolean {
  const parts = Object.fromEntries(
    kyivClock.formatToParts(date).map((part) => [part.type, part.value])
  )
  const hours = SCHEDULE[WEEKDAYS.indexOf(parts.weekday ?? "")]

  if (!hours) {
    return false
  }

  const minute = Number(parts.hour) * 60 + Number(parts.minute)

  return minute >= hours[0] && minute < hours[1]
}
