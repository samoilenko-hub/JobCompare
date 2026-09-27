// src/calculations/compareJobs_v3.ts

import type {
  BaselineCalculationResult,
  CalculationResult,
  ComparisonResult,
  DecisionSummary,
} from '../types/results_v3'

export type ComparisonBaseline =
  | CalculationResult
  | BaselineCalculationResult

function isNotWorking(
  baseline: ComparisonBaseline,
): baseline is BaselineCalculationResult {
  return 'kind' in baseline && baseline.kind === 'not_working'
}

export function buildNotWorkingBaseline(): BaselineCalculationResult {
  return {
    kind: 'not_working',
    grossMonthly: 0,
    realNetMonthly: 0,
    totalTimeHoursWeekly: 0,
    effectiveNetPerHour: null,
    workPattern: 'Not working',
  }
}

export function compareJobs(
  candidate: CalculationResult,
  baseline: ComparisonBaseline,
): ComparisonResult {
  const baseNet = baseline.realNetMonthly
  const baseTime = isNotWorking(baseline)
    ? baseline.totalTimeHoursWeekly
    : baseline.time.totalTimeHoursWeekly
  const baseRate = isNotWorking(baseline)
    ? null
    : baseline.effectiveNetPerHour

  return {
    jobId: candidate.jobId,
    baselineJobId: isNotWorking(baseline) ? undefined : baseline.jobId,

    incomeDifferenceMonthly:
      candidate.realNetMonthly === null || baseNet === null
        ? null
        : candidate.realNetMonthly - baseNet,

    timeDifferenceHoursWeekly:
      candidate.time.totalTimeHoursWeekly === null || baseTime === null
        ? null
        : candidate.time.totalTimeHoursWeekly - baseTime,

    effectiveNetPerHourDifference:
      candidate.effectiveNetPerHour === null || baseRate === null
        ? null
        : candidate.effectiveNetPerHour - baseRate,
  }
}

export function buildDecisionSummary(
  result: CalculationResult,
  comparison: ComparisonResult,
): DecisionSummary {
  return {
    jobId: result.jobId,
    estimatedGrossMonthly: result.income.grossMonthly,
    realNetMonthly: result.realNetMonthly,
    incomeDifferenceMonthly: comparison.incomeDifferenceMonthly,
    totalTimeHoursWeekly: result.time.totalTimeHoursWeekly,
    timeDifferenceHoursWeekly: comparison.timeDifferenceHoursWeekly,
    effectiveNetPerHour: result.effectiveNetPerHour,
    workPattern: result.workPattern.summary,
  }
}

export function buildBaselineDecisionSummary(
  baseline: CalculationResult,
): DecisionSummary {
  return {
    jobId: baseline.jobId,
    estimatedGrossMonthly: baseline.income.grossMonthly,
    realNetMonthly: baseline.realNetMonthly,
    incomeDifferenceMonthly: 0,
    totalTimeHoursWeekly: baseline.time.totalTimeHoursWeekly,
    timeDifferenceHoursWeekly: 0,
    effectiveNetPerHour: baseline.effectiveNetPerHour,
    workPattern: baseline.workPattern.summary,
  }
}
