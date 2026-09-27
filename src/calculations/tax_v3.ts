// src/calculations/tax_v3.ts

import type { TaxRules } from '../types/rules_v3'

export function calculatePersonalAllowance(
  annualIncome: number,
  rules: TaxRules,
): number {
  if (annualIncome <= rules.personalAllowanceTaperStartAnnual) {
    return rules.personalAllowanceAnnual
  }

  const reduction =
    (annualIncome - rules.personalAllowanceTaperStartAnnual) / 2

  return Math.max(0, rules.personalAllowanceAnnual - reduction)
}

export function calculateIncomeTaxAnnual(
  annualIncome: number,
  rules: TaxRules,
): number {
  const income = Math.max(0, annualIncome)
  const allowance = calculatePersonalAllowance(income, rules)
  const taxable = Math.max(0, income - allowance)

  const basicTaxable = Math.min(taxable, rules.basicRateBandAnnual)
  const basicTax = basicTaxable * rules.basicRate

  const higherBandTopTaxable =
    Math.max(0, rules.additionalRateThresholdAnnual - allowance)

  const higherTaxable = Math.max(
    0,
    Math.min(taxable, higherBandTopTaxable) - rules.basicRateBandAnnual,
  )
  const higherTax = higherTaxable * rules.higherRate

  const additionalTaxable = Math.max(0, taxable - higherBandTopTaxable)
  const additionalTax = additionalTaxable * rules.additionalRate

  return basicTax + higherTax + additionalTax
}
