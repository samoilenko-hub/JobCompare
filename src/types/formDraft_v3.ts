export interface JobDraft {
  position: string
  company: string
  location: string
  employmentType: string
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

  additionalWorkCosts: {
    id: string
    description: string
    amount: string
    frequency: 'workday' | 'week' | 'month' | 'year'
  }[]

  routeFuelEnabled: boolean
  routeDistanceMilesPerWorkday: string
  routeFuelType: 'petrol' | 'diesel'
  routeFuelConsumptionLitresPer100Km: string
}

export interface CurrentJobDraft {
  position: string
  company: string
  location: string
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

  additionalWorkCosts: {
    id: string
    description: string
    amount: string
    frequency: 'workday' | 'week' | 'month' | 'year'
  }[]

  routeFuelEnabled: boolean
  routeDistanceMilesPerWorkday: string
  routeFuelType: 'petrol' | 'diesel'
  routeFuelConsumptionLitresPer100Km: string
}

export interface HomeTravelDraft {
  homePostcode: string
  hasCar: boolean
  fuelType: string
  fuelConsumptionLitresPer100Km: string
}
