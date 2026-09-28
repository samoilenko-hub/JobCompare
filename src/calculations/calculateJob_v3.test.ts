import { describe, expect, it } from 'vitest'

import { calculateJob } from './calculateJob_v3'
import { compareJobs } from './compareJobs_v3'
import { defaultRules } from '../rules/defaultRules_v3'
import {
  currentJobV3,
  loveRokzV3,
  amazonDeliveryV3,
  pklCleaningV3,
  teacherAssistantV3,
  xyzProjectManagerV3,
  tescoStoreAssistantV3,
  oneStopStoreAssistantV3,
} from '../testData/referenceJobs_v3'

const referenceCases = [
  {
    job: currentJobV3,
    grossMonthly: 2166.67,
    realNetMonthly: 1622.85,
    totalTimeHoursWeekly: 40.2,
    effectiveNetPerHour: 9.32,
    workPattern: 'Day · No weekend work',
  },
  {
    job: loveRokzV3,
    grossMonthly: 1560.00,
    realNetMonthly: 1292.96,
    totalTimeHoursWeekly: 28.5,
    effectiveNetPerHour: 10.47,
    workPattern: 'Day · No weekend work',
  },
  {
    job: pklCleaningV3,
    grossMonthly: 2336.53,
    realNetMonthly: 1613.03,
    totalTimeHoursWeekly: 45.0,
    effectiveNetPerHour: 8.27,
    workPattern: 'Day · No weekend work',
  },
  {
    job: amazonDeliveryV3,
    grossMonthly: 3900.00,
    realNetMonthly: 1236.22,
    totalTimeHoursWeekly: 67.5,
    effectiveNetPerHour: 4.23,
    workPattern: 'Evening · Saturday',
  },
  {
    job: teacherAssistantV3,
    grossMonthly: 2058.33,
    realNetMonthly: 1587.12,
    totalTimeHoursWeekly: 40.0,
    effectiveNetPerHour: 9.16,
    workPattern: 'Day · No weekend work',
  },
  {
    job: xyzProjectManagerV3,
    grossMonthly: 3000.00,
    realNetMonthly: 1859.68,
    totalTimeHoursWeekly: 52.5,
    effectiveNetPerHour: 8.17,
    workPattern: 'Day · No weekend work',
  },
  {
    job: tescoStoreAssistantV3,
    grossMonthly: 950.56,
    realNetMonthly: 706.75,
    totalTimeHoursWeekly: 21.7,
    effectiveNetPerHour: 7.52,
    workPattern: 'Variable · Saturday + Sunday',
  },
  {
    job: oneStopStoreAssistantV3,
    grossMonthly: 1092.00,
    realNetMonthly: 1079.54,
    totalTimeHoursWeekly: 26.8,
    effectiveNetPerHour: 9.28,
    workPattern: 'Evening · Saturday + Sunday',
  },
]

const comparisonExpected = [
  {
    job: loveRokzV3,
    incomeDifferenceMonthly: -329.89,
    timeDifferenceHoursWeekly: -11.7,
    effectiveNetPerHourDifference: 1.15,
  },
  {
    job: pklCleaningV3,
    incomeDifferenceMonthly: -9.82,
    timeDifferenceHoursWeekly: 4.8,
    effectiveNetPerHourDifference: -1.05,
  },
  {
    job: amazonDeliveryV3,
    incomeDifferenceMonthly: -386.63,
    timeDifferenceHoursWeekly: 27.3,
    effectiveNetPerHourDifference: -5.10,
  },
  {
    job: teacherAssistantV3,
    incomeDifferenceMonthly: -35.73,
    timeDifferenceHoursWeekly: -0.2,
    effectiveNetPerHourDifference: -0.17,
  },
  {
    job: xyzProjectManagerV3,
    incomeDifferenceMonthly: 236.83,
    timeDifferenceHoursWeekly: 12.3,
    effectiveNetPerHourDifference: -1.15,
  },
  {
    job: tescoStoreAssistantV3,
    incomeDifferenceMonthly: -916.10,
    timeDifferenceHoursWeekly: -18.5,
    effectiveNetPerHourDifference: -1.81,
  },
  {
    job: oneStopStoreAssistantV3,
    incomeDifferenceMonthly: -543.31,
    timeDifferenceHoursWeekly: -13.3,
    effectiveNetPerHourDifference: -0.04,
  },
]

describe('calculateJob reference regression', () => {
  it.each(referenceCases)(
    'matches verified Google Sheets outputs for $job.id',
    ({
      job,
      grossMonthly,
      realNetMonthly,
      totalTimeHoursWeekly,
      effectiveNetPerHour,
      workPattern,
    }) => {
      const result = calculateJob(job, defaultRules)

      expect(result.income.grossMonthly).toBeCloseTo(grossMonthly, 2)
      expect(result.realNetMonthly).toBeCloseTo(realNetMonthly, 2)
      expect(result.time.totalTimeHoursWeekly).toBeCloseTo(
        totalTimeHoursWeekly,
        1,
      )
      expect(result.effectiveNetPerHour).toBeCloseTo(
        effectiveNetPerHour,
        2,
      )
      expect(result.workPattern.summary).toBe(workPattern)
    },
  )
})

describe('comparison reference regression', () => {
  const currentResult = calculateJob(currentJobV3, defaultRules)

  it.each(comparisonExpected)(
    'matches verified comparison outputs for $job.id',
    ({
      job,
      incomeDifferenceMonthly,
      timeDifferenceHoursWeekly,
      effectiveNetPerHourDifference,
    }) => {
      const candidateResult = calculateJob(job, defaultRules)
      const comparison = compareJobs(candidateResult, currentResult)

      expect(comparison.incomeDifferenceMonthly).toBeCloseTo(
        incomeDifferenceMonthly,
        2,
      )
      expect(comparison.timeDifferenceHoursWeekly).toBeCloseTo(
        timeDifferenceHoursWeekly,
        1,
      )
      expect(comparison.effectiveNetPerHourDifference).toBeCloseTo(
        effectiveNetPerHourDifference,
        2,
      )
    },
  )
})
