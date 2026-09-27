// src/calculations/calculateJob_v3.ts

import type { Job } from '../types/job_v3'
import type { CalculationRules } from '../types/rules_v3'
import type {
  CalculationResult,
  WeekendDay,
  WorkPatternResult,
} from '../types/results_v3'

import { calculateGrossAnnual } from './pay_v3'
import {
  calculateIncomeTaxAnnual,
} from './tax_v3'
import {
  calculateEmployeeNIAnnual,
  calculateSelfEmployedNIAnnual,
} from './nationalInsurance_v3'
import {
  calculateAdditionalWorkCostsMonthly,
} from './costs_v3'
import { calculateCommute } from './commute_v3'
import { calculateTime } from './time_v3'
import { calculateShiftCategory } from './shift_v3'

function displayShift(category: WorkPatternResult['effectiveShiftCategory']): string {
  switch (category) {
    case 'early': return 'Early morning'
    case 'day': return 'Day'
    case 'evening': return 'Evening'
    case 'night': return 'Night'
    case 'variable': return 'Variable'
    case 'unknown': return 'No data'
  }
}

function buildWorkPattern(
  job: Job,
  rules: CalculationRules,
): WorkPatternResult {
  const calculatedShiftCategory = calculateShiftCategory(
    job.schedule,
    rules.product.shift,
  )

  const effectiveShiftCategory =
    job.schedule.shiftCategoryOverride ?? calculatedShiftCategory

  const weekendDaysWorked = job.schedule.workingDays.filter(
    (day): day is WeekendDay => day === 'sat' || day === 'sun',
  )

  let weekendText = 'No weekend work'
  if (
    weekendDaysWorked.includes('sat') &&
    weekendDaysWorked.includes('sun')
  ) {
    weekendText = 'Saturday + Sunday'
  } else if (weekendDaysWorked.includes('sat')) {
    weekendText = 'Saturday'
  } else if (weekendDaysWorked.includes('sun')) {
    weekendText = 'Sunday'
  }

  return {
    calculatedShiftCategory,
    shiftCategoryOverride: job.schedule.shiftCategoryOverride,
    effectiveShiftCategory,
    weekendDaysWorked,
    summary: `${displayShift(effectiveShiftCategory)} · ${weekendText}`,
  }
}

export function calculateJob(
  job: Job,
  rules: CalculationRules,
): CalculationResult {
  const grossAnnual = calculateGrossAnnual(job, rules)
  const grossMonthly = grossAnnual / rules.system.monthsPerYear

  const additional = calculateAdditionalWorkCostsMonthly(job, rules)
  const additionalAnnual = additional.total * rules.system.monthsPerYear

  /**
   * Employed: taxable income is gross salary.
   * Self-employed: all Additional Expenses reduce profit before Tax/NI.
   * Profit is floored at zero for the MVP tax estimate.
   */
  const taxableIncomeAnnual =
    job.employmentType === 'self_employed'
      ? Math.max(0, grossAnnual - additionalAnnual)
      : grossAnnual

  const incomeTaxAnnual = calculateIncomeTaxAnnual(
    taxableIncomeAnnual,
    rules.official.tax,
  )

  const nationalInsuranceAnnual =
    job.employmentType === 'self_employed'
      ? calculateSelfEmployedNIAnnual(
          taxableIncomeAnnual,
          rules.official.selfEmployedNI,
        )
      : calculateEmployeeNIAnnual(
          grossAnnual,
          rules.official.employeeNI,
        )

  const incomeTaxMonthly =
    incomeTaxAnnual / rules.system.monthsPerYear
  const nationalInsuranceMonthly =
    nationalInsuranceAnnual / rules.system.monthsPerYear
  const taxAndNIMonthly =
    incomeTaxMonthly + nationalInsuranceMonthly

  /**
   * For self-employed jobs, Additional Expenses have already been deducted
   * to create taxable profit and must NOT be deducted a second time.
   */
  const netMonthly =
    job.employmentType === 'self_employed'
      ? taxableIncomeAnnual / rules.system.monthsPerYear - taxAndNIMonthly
      : grossMonthly - taxAndNIMonthly

  const commute = calculateCommute(job, rules)
  const time = calculateTime(job, commute.travelHoursWeekly, rules)

  const commuteKnown =
    commute.fuelMonthly !== null && commute.parkingMonthly !== null

  const commuteCostMonthly =
    commuteKnown
      ? commute.fuelMonthly! + commute.parkingMonthly!
      : null

  const totalWorkCostsMonthly =
    commuteCostMonthly === null
      ? null
      : commuteCostMonthly + additional.total

  /**
   * Employed: subtract commute + Additional Costs after tax.
   * Self-employed: Additional Expenses were already deducted before tax;
   * only commute is deducted here.
   */
  const realNetMonthly =
    commuteCostMonthly === null
      ? null
      : job.employmentType === 'self_employed'
        ? netMonthly - commuteCostMonthly
        : netMonthly - commuteCostMonthly - additional.total

  const effectiveNetPerHour =
    realNetMonthly === null ||
    time.totalTimeHoursMonthly === null ||
    time.totalTimeHoursMonthly === 0
      ? null
      : realNetMonthly / time.totalTimeHoursMonthly

  return {
    jobId: job.id,
    income: {
      grossAnnual,
      grossMonthly,
      taxableIncomeAnnual,
      incomeTaxAnnual,
      incomeTaxMonthly,
      nationalInsuranceAnnual,
      nationalInsuranceMonthly,
      taxAndNIMonthly,
      netMonthly,
    },
    costs: {
      commuteFuelMonthly: commute.fuelMonthly,
      parkingMonthly: commute.parkingMonthly,
      additionalWorkCostsMonthly: additional.total,
      additionalItems: additional.items,
      totalWorkCostsMonthly,
    },
    time,
    workPattern: buildWorkPattern(job, rules),
    realNetMonthly,
    effectiveNetPerHour,
  }
}
