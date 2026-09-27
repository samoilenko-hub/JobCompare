// src/calculations/time_v3.ts

import type { Job } from '../types/job_v3'
import type { CalculationRules } from '../types/rules_v3'

export interface TimeCalculation {
  actualWorkHoursWeekly: number
  actualWorkHoursMonthly: number
  travelHoursWeekly: number | null
  travelHoursMonthly: number | null
  totalTimeHoursWeekly: number | null
  totalTimeHoursMonthly: number | null
}

export function calculateTime(
  job: Job,
  travelHoursWeekly: number | null,
  rules: CalculationRules,
): TimeCalculation {
  const actualWorkHoursWeekly =
    job.schedule.expectedActualHoursPerWeek ??
    job.schedule.advertisedHoursPerWeek

  const actualWorkHoursMonthly =
    actualWorkHoursWeekly * rules.system.averageWeeksPerMonth

  const travelHoursMonthly =
    travelHoursWeekly === null
      ? null
      : travelHoursWeekly * rules.system.averageWeeksPerMonth

  const totalTimeHoursWeekly =
    travelHoursWeekly === null
      ? null
      : actualWorkHoursWeekly + travelHoursWeekly

  const totalTimeHoursMonthly =
    totalTimeHoursWeekly === null
      ? null
      : totalTimeHoursWeekly * rules.system.averageWeeksPerMonth

  return {
    actualWorkHoursWeekly,
    actualWorkHoursMonthly,
    travelHoursWeekly,
    travelHoursMonthly,
    totalTimeHoursWeekly,
    totalTimeHoursMonthly,
  }
}
