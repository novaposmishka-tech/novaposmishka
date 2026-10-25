import { describe, expect, it } from "vitest"

import { isClinicOpen } from "./working-hours"

// October 2026 in Kyiv is UTC+3 until the 25th, so 05:00Z is 08:00 there.
// 2026-10-19 is a Monday, the 24th a Saturday and the 25th a Sunday.
describe("isClinicOpen", () => {
  it("opens at 8:00 on a weekday", () => {
    expect(isClinicOpen(new Date("2026-10-19T04:59:00Z"))).toBe(false)
    expect(isClinicOpen(new Date("2026-10-19T05:00:00Z"))).toBe(true)
  })

  it("closes at 20:00 on a weekday", () => {
    expect(isClinicOpen(new Date("2026-10-23T16:59:00Z"))).toBe(true)
    expect(isClinicOpen(new Date("2026-10-23T17:00:00Z"))).toBe(false)
  })

  it("keeps Saturday's shorter hours, 9:00 to 15:00", () => {
    expect(isClinicOpen(new Date("2026-10-24T05:59:00Z"))).toBe(false)
    expect(isClinicOpen(new Date("2026-10-24T06:00:00Z"))).toBe(true)
    expect(isClinicOpen(new Date("2026-10-24T11:59:00Z"))).toBe(true)
    expect(isClinicOpen(new Date("2026-10-24T12:00:00Z"))).toBe(false)
  })

  it("is closed all of Sunday", () => {
    expect(isClinicOpen(new Date("2026-10-25T09:00:00Z"))).toBe(false)
  })

  it("follows Kyiv onto winter time", () => {
    // From the 25th Kyiv is UTC+2: 05:30Z on Monday 2 November is 07:30
    // there, before opening, though it was 08:30 a fortnight earlier.
    expect(isClinicOpen(new Date("2026-11-02T05:30:00Z"))).toBe(false)
    expect(isClinicOpen(new Date("2026-11-02T06:00:00Z"))).toBe(true)
  })
})
