// src/types/job.ts

/**
 * Canonical user-editable input model for JobCompare.
 * Calculated values do not belong in this file.
 */

import type { ShiftCategory } from './results_v3'

export type EmploymentType = 'employed' | 'self_employed'
export type WorkStatus = EmploymentType | 'not_working'

export type ContractType = 'permanent' | 'fixed_term' | 'temporary'
export type WorkloadType = 'full_time' | 'part_time'

export interface Contract {
  type: ContractType
  durationMonths?: number
  note?: string
}

export type PayBasis = 'hour' | 'day' | 'week' | 'month' | 'year'

export interface EmployedPay {
  kind: 'employed'
  basis: PayBasis
  amount: number
}

export type IncomeFrequency = 'day' | 'week' | 'month' | 'year'

export interface SelfEmployedPay {
  kind: 'self_employed'
  /** Gross business revenue before Additional Expenses. */
  revenueAmount: number
  revenueFrequency: IncomeFrequency
}

export type Pay = EmployedPay | SelfEmployedPay

export type Weekday =
  | 'mon'
  | 'tue'
  | 'wed'
  | 'thu'
  | 'fri'
  | 'sat'
  | 'sun'

export interface Schedule {
  advertisedHoursPerWeek: number

  /**
   * Realistic time consumed by the work itself.
   * UI may initialise this from advertisedHoursPerWeek when the user
   * has no better estimate.
   */
  expectedActualHoursPerWeek?: number

  /**
   * Average number of actual work outings/shifts per week.
   * Drives daily pay, commute trips, parking and Workday costs.
   */
  shiftsPerWeek: number

  /**
   * Stated/possible working days. Used for weekend/work-pattern analysis,
   * never as a substitute for shiftsPerWeek.
   */
  workingDays: Weekday[]

  startTime?: string
  endTime?: string
  hoursVary: boolean

  /**
   * Optional user correction to the automatically calculated category.
   */
  shiftCategoryOverride?: Exclude<ShiftCategory, 'unknown'>
}

export type WorkplaceType = 'on_site' | 'remote'

export interface Workplace {
  type: WorkplaceType

  /** Full address or postcode used for commute calculations. */
  postcodeOrAddress?: string

  /** Short human-readable location used in comparison UI. */
  displayLocation?: string
}

export type CommuteMode = 'car' | 'walk' | 'public_transport'

export interface Commute {
  mode: CommuteMode

  /**
   * Undefined means No data. Zero means a known zero.
   */
  distanceMilesOneWay?: number
  travelMinutesOneWay?: number
  parkingCostPerWorkday?: number
}

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'other'

export interface Vehicle {
  fuelType: FuelType

  /**
   * Undefined means No data; do not silently treat it as zero consumption.
   */
  consumptionLitresPer100Km?: number
}

export type WorkCostType =
  | 'route_fuel'
  | 'vehicle_rental'
  | 'insurance'
  | 'parking'
  | 'other'

export type CostFrequency = 'workday' | 'week' | 'month' | 'year'
export type CostSource = 'user_entered' | 'calculated'

export interface WorkCost {
  id: string
  type: WorkCostType
  description?: string
  amount: number
  frequency: CostFrequency
  source?: CostSource

  /**
   * Source inputs retained for calculated route-fuel costs so the
   * calculation can be reproduced and edited later.
   */
  routeDistanceMilesPerWorkday?: number
  fuelType?: FuelType
  fuelPricePerLitre?: number
  consumptionLitresPer100Km?: number
}

/**
 * MVP career areas are free-form labels, not a closed occupation taxonomy.
 * Example: "Project Management", "Teaching", "Retail".
 */
export type CareerArea = string

export interface Job {
  /** Stable ID that does not change when the job is edited. */
  id: string
  companyName?: string
  position: string

  employmentType: EmploymentType
  contract?: Contract
  workloadType?: WorkloadType

  pay: Pay
  schedule: Schedule
  workplace: Workplace

  /**
   * Not required for Remote. For on-site work, missing required commute
   * inputs must propagate as No data rather than £0.
   */
  commute?: Commute
  vehicle?: Vehicle

  /**
   * Canonical Additional Expenses / additional work-cost collection.
   * For self-employed jobs these are deducted before estimated Tax/NI.
   */
  workCosts: WorkCost[]

  careerAreas: CareerArea[]
}

/**
 * Current situation can be either a real Job or an explicit Not Working
 * baseline. No fake zero-income Job is required.
 */
export type CurrentSituation =
  | { status: 'not_working' }
  | { status: EmploymentType; job: Job }
