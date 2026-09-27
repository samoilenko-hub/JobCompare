// src/calculations/pay_v3.ts

import type { Job } from '../types/job_v3'
import type { CalculationRules } from '../types/rules_v3'

export function calculateGrossAnnual(
  job: Job,
  rules: CalculationRules,
): number {
  const { weeksPerYear, monthsPerYear } = rules.system

  if (job.pay.kind === 'self_employed') {
    switch (job.pay.revenueFrequency) {
      case 'day':
        return job.pay.revenueAmount * job.schedule.shiftsPerWeek * weeksPerYear
      case 'week':
        return job.pay.revenueAmount * weeksPerYear
      case 'month':
        return job.pay.revenueAmount * monthsPerYear
      case 'year':
        return job.pay.revenueAmount
    }
  }

  switch (job.pay.basis) {
    case 'hour':
      return (
        job.pay.amount *
        job.schedule.advertisedHoursPerWeek *
        weeksPerYear
      )
    case 'day':
      return job.pay.amount * job.schedule.shiftsPerWeek * weeksPerYear
    case 'week':
      return job.pay.amount * weeksPerYear
    case 'month':
      return job.pay.amount * monthsPerYear
    case 'year':
      return job.pay.amount
  }
}

export function calculateGrossMonthly(
  job: Job,
  rules: CalculationRules,
): number {
  return calculateGrossAnnual(job, rules) / rules.system.monthsPerYear
}
