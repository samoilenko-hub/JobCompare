// src/types/results.ts

/**
 * Canonical read-only calculation outputs for JobCompare.
 */

import type { Weekday } from './job_v3'

export type ShiftCategory =
  | 'early'
  | 'day'
  | 'evening'
  | 'night'
  | 'variable'
  | 'unknown'

export type WeekendDay = Extract<Weekday, 'sat' | 'sun'>

export interface WorkPatternResult {
  calculatedShiftCategory: ShiftCategory
  shiftCategoryOverride?: Exclude<ShiftCategory, 'unknown'>
  effectiveShiftCategory: ShiftCategory

  /** Structured source for weekend logic; never parse the display string. */
  weekendDaysWorked: WeekendDay[]

  /**
   * Factual display value, e.g.
   * "Day · No weekend work"
   * "Evening · Saturday"
   * "Variable · Saturday + Sunday"
   */
  summary: string
}

export interface IncomeResult {
  /** Revenue/salary before tax and costs. */
  grossAnnual: number
  grossMonthly: number

  /**
   * Taxable employment income or self-employed profit used by the estimate.
   */
  taxableIncomeAnnual: number

  incomeTaxAnnual: number
  incomeTaxMonthly: number
  nationalInsuranceAnnual: number
  nationalInsuranceMonthly: number
  taxAndNIMonthly: number

  /**
   * Employed: gross less Tax/NI.
   * Self-employed: profit less Tax/NI, after Additional Expenses.
   */
  netMonthly: number
}

export interface WorkCostItemResult {
  id: string
  description: string
  monthlyAmount: number
}

export interface WorkCostResult {
  commuteFuelMonthly: number | null
  parkingMonthly: number | null
  additionalWorkCostsMonthly: number
  additionalItems: WorkCostItemResult[]

  /**
   * Null when a required component is No data.
   */
  totalWorkCostsMonthly: number | null
}

export interface TimeResult {
  actualWorkHoursMonthly: number
  travelHoursMonthly: number | null
  totalTimeHoursMonthly: number | null

  actualWorkHoursWeekly: number
  travelHoursWeekly: number | null
  totalTimeHoursWeekly: number | null
}

export interface CalculationResult {
  jobId: string
  income: IncomeResult
  costs: WorkCostResult
  time: TimeResult
  workPattern: WorkPatternResult

  /**
   * Null means the result cannot be calculated because required data is
   * missing. Zero is a valid calculated value and is not Missing Data.
   */
  realNetMonthly: number | null
  effectiveNetPerHour: number | null
}

export interface BaselineCalculationResult {
  kind: 'not_working'
  grossMonthly: 0
  realNetMonthly: 0
  totalTimeHoursWeekly: 0
  effectiveNetPerHour: null
  workPattern: 'Not working'
}

export interface ComparisonResult {
  jobId: string
  baselineJobId?: string

  incomeDifferenceMonthly: number | null
  timeDifferenceHoursWeekly: number | null

  /**
   * Null for a Not Working baseline or whenever either rate is unavailable.
   */
  effectiveNetPerHourDifference: number | null
}

export interface DecisionSummary {
  jobId: string
  estimatedGrossMonthly: number
  realNetMonthly: number | null
  incomeDifferenceMonthly: number | null
  totalTimeHoursWeekly: number | null
  timeDifferenceHoursWeekly: number | null
  effectiveNetPerHour: number | null
  workPattern: string
}
