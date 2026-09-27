// src/types/rules.ts

/**
 * Central configuration for JobCompare.
 * Calculation functions read these values rather than hard-coding them.
 */

export interface TaxRules {
  taxYear: string
  personalAllowanceAnnual: number
  personalAllowanceTaperStartAnnual: number
  basicRateBandAnnual: number
  basicRate: number
  higherRate: number
  additionalRateThresholdAnnual: number
  additionalRate: number
}

export interface EmployeeNIRules {
  primaryThresholdAnnual: number
  upperEarningsLimitAnnual: number
  mainRate: number
  upperRate: number
}

export interface SelfEmployedNIRules {
  lowerProfitsLimitAnnual: number
  upperProfitsLimitAnnual: number
  mainRate: number
  upperRate: number
}

export interface OfficialRules {
  tax: TaxRules
  employeeNI: EmployeeNIRules
  selfEmployedNI: SelfEmployedNIRules
}

export interface SystemRules {
  weeksPerYear: number
  monthsPerYear: number
  averageWeeksPerMonth: number
  milesToKm: number
}

export interface ShiftRules {
  nightStart: string
  nightEnd: string
  earlyMorningStart: string
  earlyMorningEnd: string
  dayStart: string
  dayEnd: string
  eveningStart: string
  eveningEnd: string

  /**
   * Agreed lifestyle-impact precedence when categories overlap.
   */
  categoryPriority: readonly ['night', 'evening', 'early', 'day']
}

export interface ProductRules {
  shift: ShiftRules
  weekdayDays: readonly ['mon', 'tue', 'wed', 'thu', 'fri']
  weekendDays: readonly ['sat', 'sun']

  /**
   * Free Weekends matches only when neither Saturday nor Sunday is worked.
   */
  freeWeekendsRequireBothDaysFree: true

  /**
   * Preferred Shift uses exact category matching; Variable only matches Variable.
   */
  preferredShiftRequiresExactCategory: true

  /**
   * Equality versus baseline is Neutral / No Match for improvement priorities.
   */
  equalValueIsPriorityMatch: false
}

export interface FuelPriceAssumptions {
  petrolPerLitre: number
  dieselPerLitre: number
}

export interface DeliveryAssumptions {
  vanRentalPerWeek: number
  routeDistanceMilesPerWorkday: number
  vanConsumptionLitresPer100Km: number
}

export interface TaxAssumptions {
  defaultTaxCode: string
  takeHomeScope: string
}

export interface AssumptionsAndDefaults {
  fuelPrices: FuelPriceAssumptions
  tax: TaxAssumptions
  delivery: DeliveryAssumptions
}

export interface CalculationRules {
  official: OfficialRules
  system: SystemRules
  product: ProductRules
  assumptions: AssumptionsAndDefaults
}
