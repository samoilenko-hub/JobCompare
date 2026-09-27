// src/calculations/commute_v3.ts

import type { Job } from '../types/job_v3'
import type { CalculationRules } from '../types/rules_v3'

export interface CommuteCalculation {
  fuelMonthly: number | null
  parkingMonthly: number | null
  travelHoursWeekly: number | null
  travelHoursMonthly: number | null
}

function fuelPriceForJob(
  job: Job,
  rules: CalculationRules,
): number | null {
  if (!job.vehicle) return null

  switch (job.vehicle.fuelType) {
    case 'petrol':
      return rules.assumptions.fuelPrices.petrolPerLitre
    case 'diesel':
      return rules.assumptions.fuelPrices.dieselPerLitre
    case 'electric':
    case 'other':
      return null
  }
}

export function calculateCommute(
  job: Job,
  rules: CalculationRules,
): CommuteCalculation {
  if (job.workplace.type === 'remote') {
    return {
      fuelMonthly: 0,
      parkingMonthly: 0,
      travelHoursWeekly: 0,
      travelHoursMonthly: 0,
    }
  }

  const commute = job.commute
  if (!commute) {
    return {
      fuelMonthly: null,
      parkingMonthly: null,
      travelHoursWeekly: null,
      travelHoursMonthly: null,
    }
  }

  const travelHoursWeekly =
    commute.travelMinutesOneWay === undefined
      ? null
      : (commute.travelMinutesOneWay * 2 * job.schedule.shiftsPerWeek) / 60

  const travelHoursMonthly =
    travelHoursWeekly === null
      ? null
      : travelHoursWeekly * rules.system.averageWeeksPerMonth

  if (commute.mode === 'walk') {
    return {
      fuelMonthly: 0,
      parkingMonthly: 0,
      travelHoursWeekly,
      travelHoursMonthly,
    }
  }

  if (commute.mode === 'public_transport') {
    // Reserved for future scope. Do not pretend its monetary cost is zero.
    return {
      fuelMonthly: null,
      parkingMonthly: 0,
      travelHoursWeekly,
      travelHoursMonthly,
    }
  }

  const parkingMonthly =
    commute.parkingCostPerWorkday === undefined
      ? null
      : commute.parkingCostPerWorkday *
        job.schedule.shiftsPerWeek *
        rules.system.averageWeeksPerMonth

  const price = fuelPriceForJob(job, rules)
  const consumption = job.vehicle?.consumptionLitresPer100Km

  const fuelMonthly =
    commute.distanceMilesOneWay === undefined ||
    consumption === undefined ||
    price === null
      ? null
      : (((commute.distanceMilesOneWay *
            2 *
            job.schedule.shiftsPerWeek *
            rules.system.averageWeeksPerMonth *
            rules.system.milesToKm) /
            100) *
          consumption *
          price)

  return {
    fuelMonthly,
    parkingMonthly,
    travelHoursWeekly,
    travelHoursMonthly,
  }
}
