// src/testData/referenceJobs_v3.ts

import type { Job } from '../types/job_v3'
import { buildRouteFuelCost } from '../calculations/costs_v3'
import { defaultRules } from '../rules/defaultRules_v3'

const dieselCar = {
  fuelType: 'diesel' as const,
  consumptionLitresPer100Km: 10,
}

export const currentJobV3: Job = {
  id: 'current-rct-clerk',
  companyName: 'Rhondda Cynon Taf Council',
  position: 'Clerk',
  employmentType: 'employed',
  contract: { type: 'fixed_term', durationMonths: 12 },
  workloadType: 'full_time',
  pay: { kind: 'employed', basis: 'year', amount: 26_000 },
  schedule: {
    advertisedHoursPerWeek: 35,
    expectedActualHoursPerWeek: 35,
    shiftsPerWeek: 5,
    workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '09:00',
    endTime: '17:00',
    hoursVary: false,
  },
  workplace: { type: 'on_site', displayLocation: 'Merthyr Tydfil' },
  commute: {
    mode: 'car',
    distanceMilesOneWay: 16.9,
    travelMinutesOneWay: 31,
    parkingCostPerWorkday: 0,
  },
  vehicle: dieselCar,
  workCosts: [],
  careerAreas: ['Administration'],
}

export const loveRokzV3: Job = {
  id: 'love-rokz-production',
  companyName: 'Love Rokz',
  position: 'Production Operative',
  employmentType: 'employed',
  contract: { type: 'permanent' },
  workloadType: 'part_time',
  pay: { kind: 'employed', basis: 'hour', amount: 15 },
  schedule: {
    advertisedHoursPerWeek: 24,
    expectedActualHoursPerWeek: 24,
    shiftsPerWeek: 3,
    workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '09:00',
    endTime: '17:00',
    hoursVary: false,
  },
  workplace: { type: 'on_site', displayLocation: 'Pontypridd' },
  commute: {
    mode: 'car',
    distanceMilesOneWay: 15.1,
    travelMinutesOneWay: 45,
    parkingCostPerWorkday: 0,
  },
  vehicle: dieselCar,
  workCosts: [],
  careerAreas: ['Manufacturing', 'Production'],
}

const amazonRouteFuel = buildRouteFuelCost(
  'amazon-route-fuel',
  defaultRules.assumptions.delivery.routeDistanceMilesPerWorkday,
  defaultRules.assumptions.delivery.vanConsumptionLitresPer100Km,
  defaultRules.assumptions.fuelPrices.dieselPerLitre,
  defaultRules,
)

export const amazonDeliveryV3: Job = {
  id: 'amazon-dcf2-delivery',
  companyName: 'Amazon DSP',
  position: 'Delivery Driver',
  employmentType: 'self_employed',
  contract: { type: 'permanent' },
  workloadType: 'full_time',
  pay: { kind: 'self_employed', revenueAmount: 180, revenueFrequency: 'day' },
  schedule: {
    advertisedHoursPerWeek: 40,
    expectedActualHoursPerWeek: 55,
    shiftsPerWeek: 5,
    workingDays: ['mon', 'tue', 'wed', 'fri', 'sat'],
    startTime: '11:15',
    endTime: '22:00',
    hoursVary: false,
  },
  workplace: { type: 'on_site', displayLocation: 'Cardiff' },
  commute: {
    mode: 'car',
    distanceMilesOneWay: 30,
    travelMinutesOneWay: 75,
    parkingCostPerWorkday: 0,
  },
  vehicle: dieselCar,
  workCosts: [
    {
      id: 'van-rental',
      type: 'vehicle_rental',
      description: 'Van rental',
      amount: 250,
      frequency: 'week',
      source: 'user_entered',
    },
    amazonRouteFuel,
  ],
  careerAreas: ['Delivery', 'Logistics'],
}

export const pklCleaningV3: Job = {
  id: 'pkl-cleaning',
  companyName: 'PKL Cleaning Contractors Ltd',
  position: 'Cleaning Operative',
  employmentType: 'employed',
  contract: { type: 'permanent' },
  workloadType: 'full_time',
  pay: { kind: 'employed', basis: 'hour', amount: 13.48 },
  schedule: {
    advertisedHoursPerWeek: 40,
    expectedActualHoursPerWeek: 40,
    shiftsPerWeek: 5,
    workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '09:00',
    endTime: '17:00',
    hoursVary: false,
  },
  workplace: { type: 'on_site', displayLocation: 'Pontypridd' },
  commute: {
    mode: 'car',
    distanceMilesOneWay: 10.7,
    travelMinutesOneWay: 30,
    parkingCostPerWorkday: 10,
  },
  vehicle: dieselCar,
  workCosts: [],
  careerAreas: ['Cleaning'],
}

export const teacherAssistantV3: Job = {
  id: 'teacher-assistant',
  companyName: 'Aberdare Town Church Primary School',
  position: 'Teaching Assistant',
  employmentType: 'employed',
  contract: { type: 'fixed_term', durationMonths: 9 },
  workloadType: 'part_time',
  pay: { kind: 'employed', basis: 'day', amount: 95 },
  schedule: {
    advertisedHoursPerWeek: 30,
    expectedActualHoursPerWeek: 35,
    shiftsPerWeek: 5,
    workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '08:30',
    endTime: '15:30',
    hoursVary: false,
  },
  workplace: { type: 'on_site', displayLocation: 'Aberdare' },
  commute: {
    mode: 'car',
    distanceMilesOneWay: 13.8,
    travelMinutesOneWay: 30,
    parkingCostPerWorkday: 0,
  },
  vehicle: dieselCar,
  workCosts: [],
  careerAreas: ['Teaching', 'Education'],
}

export const xyzProjectManagerV3: Job = {
  id: 'xyz-project-manager',
  companyName: 'XYZ',
  position: 'Project Manager',
  employmentType: 'employed',
  contract: { type: 'fixed_term', durationMonths: 6, note: 'Maternity cover' },
  workloadType: 'full_time',
  pay: { kind: 'employed', basis: 'year', amount: 36_000 },
  schedule: {
    advertisedHoursPerWeek: 37.5,
    expectedActualHoursPerWeek: 40,
    shiftsPerWeek: 5,
    workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    startTime: '09:00',
    endTime: '17:00',
    hoursVary: false,
  },
  workplace: { type: 'on_site', displayLocation: 'Newport' },
  commute: {
    mode: 'car',
    distanceMilesOneWay: 34,
    travelMinutesOneWay: 75,
    parkingCostPerWorkday: 6,
  },
  vehicle: dieselCar,
  workCosts: [],
  careerAreas: ['Project Management'],
}

export const tescoStoreAssistantV3: Job = {
  id: 'tesco-store-assistant',
  companyName: 'Tesco',
  position: 'Store Assistant',
  employmentType: 'employed',
  contract: { type: 'temporary' },
  workloadType: 'part_time',
  pay: { kind: 'employed', basis: 'hour', amount: 13.71 },
  schedule: {
    advertisedHoursPerWeek: 16,
    expectedActualHoursPerWeek: 16,
    shiftsPerWeek: 3,
    workingDays: ['fri', 'sat', 'sun'],
    hoursVary: true,
  },
  workplace: { type: 'on_site', displayLocation: 'Cardiff' },
  commute: {
    mode: 'car',
    distanceMilesOneWay: 29.8,
    travelMinutesOneWay: 57,
    parkingCostPerWorkday: 0,
  },
  vehicle: dieselCar,
  workCosts: [],
  careerAreas: ['Retail'],
}

export const oneStopStoreAssistantV3: Job = {
  id: 'one-stop-store-assistant',
  companyName: 'One Stop',
  position: 'Store Assistant',
  employmentType: 'employed',
  contract: { type: 'temporary' },
  workloadType: 'part_time',
  pay: { kind: 'employed', basis: 'hour', amount: 12.60 },
  schedule: {
    advertisedHoursPerWeek: 20,
    expectedActualHoursPerWeek: 26,
    shiftsPerWeek: 5,
    workingDays: ['mon', 'tue', 'fri', 'sat', 'sun'],
    startTime: '17:00',
    endTime: '22:00',
    hoursVary: false,
  },
  workplace: { type: 'on_site', displayLocation: 'Treorchy' },
  commute: {
    mode: 'walk',
    distanceMilesOneWay: 1,
    travelMinutesOneWay: 5,
  },
  workCosts: [],
  careerAreas: ['Retail'],
}

export const referenceJobsV3 = [
  currentJobV3,
  loveRokzV3,
  amazonDeliveryV3,
  pklCleaningV3,
  teacherAssistantV3,
  xyzProjectManagerV3,
  tescoStoreAssistantV3,
  oneStopStoreAssistantV3,
]
