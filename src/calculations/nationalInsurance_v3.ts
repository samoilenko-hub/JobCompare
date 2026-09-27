// src/calculations/nationalInsurance_v3.ts

import type {
  EmployeeNIRules,
  SelfEmployedNIRules,
} from '../types/rules_v3'

export function calculateEmployeeNIAnnual(
  annualGross: number,
  rules: EmployeeNIRules,
): number {
  const income = Math.max(0, annualGross)

  const mainBand = Math.max(
    0,
    Math.min(income, rules.upperEarningsLimitAnnual) -
      rules.primaryThresholdAnnual,
  )

  const upperBand = Math.max(0, income - rules.upperEarningsLimitAnnual)

  return mainBand * rules.mainRate + upperBand * rules.upperRate
}

export function calculateSelfEmployedNIAnnual(
  annualProfit: number,
  rules: SelfEmployedNIRules,
): number {
  const profit = Math.max(0, annualProfit)

  const mainBand = Math.max(
    0,
    Math.min(profit, rules.upperProfitsLimitAnnual) -
      rules.lowerProfitsLimitAnnual,
  )

  const upperBand = Math.max(0, profit - rules.upperProfitsLimitAnnual)

  return mainBand * rules.mainRate + upperBand * rules.upperRate
}
