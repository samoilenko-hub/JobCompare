import { buildRouteFuelCost } from '../calculations/costs_v3'
import type { CalculationRules } from '../types/rules_v3'
import type {
  ContractType,
  EmploymentType,
  FuelType,
  Job,
  PayBasis,
  WorkCost,
  Weekday,
} from '../types/job_v3'

export interface JobFormDraft {
  position: string
  company: string
  location: string
  employmentType?: string
  contractType: string
  payBasis: string
  payAmount: string
  advertisedHoursPerWeek: string
  actualHoursPerWeek: string
  shiftsPerWeek: string
  workingDays: string[]
  scheduleInputMode: 'hours' | 'shift'
  startTime: string
  endTime: string
  shift: string
  commuteMethod: string
  commuteDistanceMiles: string
  commuteTimeMinutes: string
  parkingPerWorkday: string

  additionalWorkCosts?: {
    id: string
    description: string
    amount: string
    frequency: 'workday' | 'week' | 'month' | 'year'
  }[]

  routeFuelEnabled?: boolean
  routeDistanceMilesPerWorkday?: string
  routeFuelType?: 'petrol' | 'diesel'
  routeFuelConsumptionLitresPer100Km?: string
}

export interface HomeTravelDraft {
  homePostcode: string
  hasCar: boolean
  fuelType: string
  fuelConsumptionLitresPer100Km: string
}

function optionalNumber(value: string): number | undefined {
  if (value.trim() === '') return undefined

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function requiredNumber(value: string): number {
  return optionalNumber(value) ?? 0
}

export function formToJob(
  id: string,
  draft: JobFormDraft,
  home: HomeTravelDraft,
  employmentType: EmploymentType,
  rules: CalculationRules,
): Job {
  const isRemote = draft.commuteMethod === 'remote'

  const contract = draft.contractType
    ? { type: draft.contractType as ContractType }
    : undefined

  const advertisedHours = requiredNumber(draft.advertisedHoursPerWeek)
  const actualHours = optionalNumber(draft.actualHoursPerWeek)

  const payAmount = requiredNumber(draft.payAmount)

  const pay: Job['pay'] =
    employmentType === 'self_employed'
      ? {
          kind: 'self_employed',
          revenueAmount: payAmount,
          revenueFrequency:
            draft.payBasis === 'hour'
              ? 'week'
              : (draft.payBasis as 'day' | 'week' | 'month' | 'year'),
        }
      : {
          kind: 'employed',
          basis: draft.payBasis as PayBasis,
          amount: payAmount,
        }

  const workCosts: WorkCost[] = (draft.additionalWorkCosts ?? [])
    .map((cost) => {
      const amount = optionalNumber(cost.amount)

      if (amount === undefined || cost.description.trim() === '') {
        return null
      }

      return {
        id: cost.id,
        type: 'other' as const,
        description: cost.description.trim(),
        amount,
        frequency: cost.frequency,
        source: 'user_entered' as const,
      }
    })
    .filter((cost): cost is NonNullable<typeof cost> => cost !== null)

  if (draft.routeFuelEnabled === true) {
    const routeDistance = optionalNumber(
      draft.routeDistanceMilesPerWorkday ?? '',
    )
    const consumption = optionalNumber(
      draft.routeFuelConsumptionLitresPer100Km ?? '',
    )

    if (
      routeDistance !== undefined &&
      consumption !== undefined &&
      routeDistance > 0 &&
      consumption > 0
    ) {
      const fuelPrice =
        draft.routeFuelType === 'petrol'
          ? rules.assumptions.fuelPrices.petrolPerLitre
          : rules.assumptions.fuelPrices.dieselPerLitre

      workCosts.push(
        buildRouteFuelCost(
          `${id}-route-fuel`,
          routeDistance,
          consumption,
          fuelPrice,
          rules,
          draft.routeFuelType as 'petrol' | 'diesel',
        ),
      )
    }
  }

  const shiftOverride =
    draft.shift &&
    draft.shift !== 'variable'
      ? (draft.shift as 'early' | 'day' | 'evening' | 'night')
      : draft.shift === 'variable'
        ? 'variable'
        : undefined

  return {
    id,
    companyName: draft.company.trim() || undefined,
    position: draft.position.trim(),

    employmentType,
    contract,

    pay,

    schedule: {
      advertisedHoursPerWeek: advertisedHours,
      expectedActualHoursPerWeek: actualHours,
      shiftsPerWeek: requiredNumber(draft.shiftsPerWeek),
      workingDays: draft.workingDays as Weekday[],
      startTime: draft.startTime || undefined,
      endTime: draft.endTime || undefined,
      hoursVary: draft.shift === 'variable',
      shiftCategoryOverride: shiftOverride,
    },

    workplace: {
      type: isRemote ? 'remote' : 'on_site',
      postcodeOrAddress: draft.location.trim() || undefined,
      displayLocation: draft.location.trim() || undefined,
    },

    commute: isRemote
      ? undefined
      : {
          mode:
            draft.commuteMethod === 'walk'
              ? 'walk'
              : draft.commuteMethod === 'public_transport'
                ? 'public_transport'
                : 'car',
          distanceMilesOneWay: optionalNumber(draft.commuteDistanceMiles),
          travelMinutesOneWay: optionalNumber(draft.commuteTimeMinutes),
          parkingCostPerWorkday:
            draft.commuteMethod === 'car'
              ? optionalNumber(draft.parkingPerWorkday)
              : 0,
        },

    vehicle:
      !isRemote && draft.commuteMethod === 'car' && home.hasCar
        ? {
            fuelType: home.fuelType as FuelType,
            consumptionLitresPer100Km: optionalNumber(
              home.fuelConsumptionLitresPer100Km,
            ),
          }
        : undefined,

    workCosts,

    careerAreas: [],
  }
}
