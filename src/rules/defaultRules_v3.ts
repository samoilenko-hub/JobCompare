// src/rules/defaultRules_v3.ts

import type { CalculationRules } from '../types/rules_v3'

export const defaultRules: CalculationRules = {
  official: {
    tax: {
      taxYear: '2026/27',
      personalAllowanceAnnual: 12_570,
      personalAllowanceTaperStartAnnual: 100_000,
      basicRateBandAnnual: 37_700,
      basicRate: 0.20,
      higherRate: 0.40,
      additionalRateThresholdAnnual: 125_140,
      additionalRate: 0.45,
    },
    employeeNI: {
      primaryThresholdAnnual: 12_570,
      upperEarningsLimitAnnual: 50_270,
      mainRate: 0.08,
      upperRate: 0.02,
    },
    selfEmployedNI: {
      lowerProfitsLimitAnnual: 12_570,
      upperProfitsLimitAnnual: 50_270,
      mainRate: 0.06,
      upperRate: 0.02,
    },
  },

  system: {
    weeksPerYear: 52,
    monthsPerYear: 12,
    averageWeeksPerMonth: 52 / 12,
    milesToKm: 1.609344,
  },

  product: {
    shift: {
      nightStart: '23:00',
      nightEnd: '07:00',
      earlyMorningStart: '04:00',
      earlyMorningEnd: '08:00',
      dayStart: '08:00',
      dayEnd: '19:00',
      eveningStart: '19:00',
      eveningEnd: '23:00',
      categoryPriority: ['night', 'evening', 'early', 'day'],
    },
    weekdayDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    weekendDays: ['sat', 'sun'],
    freeWeekendsRequireBothDaysFree: true,
    preferredShiftRequiresExactCategory: true,
    equalValueIsPriorityMatch: false,
  },

  assumptions: {
    fuelPrices: {
      petrolPerLitre: 1.7201,
      dieselPerLitre: 1.9553,
    },
    tax: {
      defaultTaxCode: '1257L',
      takeHomeScope: 'Estimated take-home only',
    },
    delivery: {
      vanRentalPerWeek: 250,
      routeDistanceMilesPerWorkday: 150,
      vanConsumptionLitresPer100Km: 9.4,
    },
  },
}
