// src/calculations/costs_v3.ts

import type { Job, WorkCost } from '../types/job_v3'
import type { CalculationRules } from '../types/rules_v3'
import type { WorkCostItemResult } from '../types/results_v3'

export function normaliseWorkCostToMonthly(
  cost: WorkCost,
  shiftsPerWeek: number,
  rules: CalculationRules,
): number {
  const { averageWeeksPerMonth, monthsPerYear } = rules.system

  switch (cost.frequency) {
    case 'workday':
      return cost.amount * shiftsPerWeek * averageWeeksPerMonth
    case 'week':
      return cost.amount * averageWeeksPerMonth
    case 'month':
      return cost.amount
    case 'year':
      return cost.amount / monthsPerYear
  }
}

export function calculateAdditionalWorkCostsMonthly(
  job: Job,
  rules: CalculationRules,
): {
  total: number
  items: WorkCostItemResult[]
} {
  const items = job.workCosts.map((cost) => ({
    id: cost.id,
    description: cost.description ?? cost.type,
    monthlyAmount: normaliseWorkCostToMonthly(
      cost,
      job.schedule.shiftsPerWeek,
      rules,
    ),
  }))

  return {
    total: items.reduce((sum, item) => sum + item.monthlyAmount, 0),
    items,
  }
}

/**
 * Helper for delivery-route fuel. The returned WorkCost can be inserted into
 * job.workCosts and is then handled exactly like every other Additional Expense.
 */
export function buildRouteFuelCost(
  id: string,
  routeMilesPerWorkday: number,
  consumptionLitresPer100Km: number,
  fuelPricePerLitre: number,
  rules: CalculationRules,
  fuelType?: 'petrol' | 'diesel',
): WorkCost {
  const routeKm = routeMilesPerWorkday * rules.system.milesToKm
  const litres = (routeKm / 100) * consumptionLitresPer100Km

  return {
    id,
    type: 'route_fuel',
    description: 'Delivery route fuel',
    amount: litres * fuelPricePerLitre,
    frequency: 'workday',
    source: 'calculated',
    routeDistanceMilesPerWorkday: routeMilesPerWorkday,
    fuelType,
    fuelPricePerLitre,
    consumptionLitresPer100Km,
  }
}
