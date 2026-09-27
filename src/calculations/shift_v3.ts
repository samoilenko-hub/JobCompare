// src/calculations/shift_v3.ts

import type { Schedule } from '../types/job_v3'
import type { ShiftRules } from '../types/rules_v3'
import type { ShiftCategory } from '../types/results_v3'

function toMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return null

  const hour = Number(match[1])
  const minute = Number(match[2])

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return hour * 60 + minute
}

function inWindow(
  minute: number,
  start: number,
  end: number,
): boolean {
  if (start < end) return minute >= start && minute < end
  return minute >= start || minute < end
}

export function calculateShiftCategory(
  schedule: Schedule,
  rules: ShiftRules,
): ShiftCategory {
  if (schedule.hoursVary) return 'variable'
  if (!schedule.startTime || !schedule.endTime) return 'unknown'

  const start = toMinutes(schedule.startTime)
  const end = toMinutes(schedule.endTime)
  if (start === null || end === null) return 'unknown'

  const ns = toMinutes(rules.nightStart)!
  const ne = toMinutes(rules.nightEnd)!
  const es = toMinutes(rules.earlyMorningStart)!
  const ee = toMinutes(rules.earlyMorningEnd)!
  const ds = toMinutes(rules.dayStart)!
  const de = toMinutes(rules.dayEnd)!
  const vs = toMinutes(rules.eveningStart)!
  const ve = toMinutes(rules.eveningEnd)!

  /**
   * Lifestyle-impact rule: if a shift touches a more disruptive category,
   * that category wins according to Night > Evening > Early > Day.
   * End time is treated as the boundary, not time worked inside the next band.
   */
  const sampleStart = start
  const lastWorkedMinute = (end - 1 + 1440) % 1440

  const touches = (windowStart: number, windowEnd: number): boolean => {
    if (start === end) return true

    // Walk minute-by-minute through at most one day. This is deliberately
    // simple and robust for MVP schedule classification.
    let m = sampleStart
    for (let i = 0; i < 1440; i += 1) {
      if (inWindow(m, windowStart, windowEnd)) return true
      if (m === lastWorkedMinute) break
      m = (m + 1) % 1440
    }
    return false
  }

  if (touches(ns, ne)) return 'night'
  if (touches(vs, ve)) return 'evening'
  if (touches(es, ee)) return 'early'
  if (touches(ds, de)) return 'day'
  return 'unknown'
}
