import type { Job } from './types/job_v3'
import type { CalculationResult } from './types/results_v3'
import { calculateJob } from './calculations/calculateJob_v3'
import { defaultRules } from './rules/defaultRules_v3'

type CurrentStatus =
  | 'employed'
  | 'self_employed'
  | 'not_working'
  | ''

type ComparisonScreenProps = {
  currentJob: Job | null
  currentResult: CalculationResult | null
  currentStatus: CurrentStatus
  userJobs: Job[]
  onAddJob: () => void
  onEditCurrent: () => void
}

const money = (value: number | null) =>
  value === null
    ? 'No data'
    : new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)

const hours = (value: number | null) =>
  value === null ? 'No data' : `${value.toFixed(1)} h / week`

const signedMoney = (value: number | null) => {
  if (value === null) return 'No data'
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${money(value)}`
}

const signedHours = (value: number | null) => {
  if (value === null) return 'No data'
  const prefix = value > 0 ? '+' : ''
  return `${prefix}${value.toFixed(1)} h / week`
}

function contractLabel(job: Job) {
  const contract = job.contract

  if (contract?.type === 'permanent') return 'Permanent'
  if (contract?.type === 'temporary') return 'Temporary'

  if (contract?.type === 'fixed_term') {
    return `Fixed-term${
      contract.durationMonths
        ? ` · ${contract.durationMonths} months`
        : ''
    }`
  }

  return 'No data'
}

function ComparisonScreen({
  currentJob,
  currentResult,
  currentStatus,
  userJobs,
  onAddJob,
  onEditCurrent,
}: ComparisonScreenProps) {
  const notWorking = currentStatus === 'not_working'

  const candidateResults = userJobs.map((job) => ({
    job,
    result: calculateJob(job, defaultRules),
  }))

  const baselineRealNet = notWorking
    ? 0
    : currentResult?.realNetMonthly ?? null

  const baselineTime = notWorking
    ? 0
    : currentResult?.time.totalTimeHoursWeekly ?? null

  return (
    <main>
      <button type="button" onClick={onEditCurrent}>
        Home
      </button>

      <h1>JobCompare</h1>
      <p>
        Compare what a job really gives you — money, time and work pattern.
      </p>

      <button type="button" onClick={onAddJob}>
        + Add job
      </button>

      <div style={{ overflowX: 'auto' }}>
        <table
          border={1}
          cellPadding={12}
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr>
              <th>Compare</th>

              <th>
                <div>Current situation</div>
                <div style={{ fontWeight: 'normal' }}>
                  {notWorking
                    ? 'Not working'
                    : currentJob?.companyName ?? 'No data'}
                </div>
              </th>

              {candidateResults.map(({ job }) => (
                <th key={job.id}>
                  <div>{job.position || 'Job'}</div>
                  <div style={{ fontWeight: 'normal' }}>
                    {job.companyName || 'No data'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>Location</th>
              <td>
                {notWorking
                  ? '—'
                  : currentJob?.workplace.displayLocation ?? 'No data'}
              </td>

              {candidateResults.map(({ job }) => (
                <td key={job.id}>
                  {job.workplace.displayLocation ?? 'No data'}
                </td>
              ))}
            </tr>

            <tr>
              <th>Employment</th>
              <td>
                {notWorking
                  ? 'Not working'
                  : currentJob?.employmentType === 'self_employed'
                    ? 'Self-employed'
                    : 'Employed'}
              </td>

              {candidateResults.map(({ job }) => (
                <td key={job.id}>
                  {job.employmentType === 'self_employed'
                    ? 'Self-employed'
                    : 'Employed'}
                </td>
              ))}
            </tr>

            <tr>
              <th>Contract</th>
              <td>
                {notWorking || !currentJob
                  ? '—'
                  : contractLabel(currentJob)}
              </td>

              {candidateResults.map(({ job }) => (
                <td key={job.id}>{contractLabel(job)}</td>
              ))}
            </tr>

            <tr>
              <th>Gross pay</th>
              <td>
                <strong>
                  {money(
                    notWorking
                      ? 0
                      : currentResult?.income.grossMonthly ?? null,
                  )}
                </strong>
                <div>/ month</div>
              </td>

              {candidateResults.map(({ job, result }) => (
                <td key={job.id}>
                  <strong>{money(result.income.grossMonthly)}</strong>
                  <div>/ month</div>
                </td>
              ))}
            </tr>

            <tr>
              <th>Real net</th>
              <td>
                <strong>
                  {money(
                    notWorking
                      ? 0
                      : currentResult?.realNetMonthly ?? null,
                  )}
                </strong>
                <div>/ month</div>
                <div>Baseline</div>
              </td>

              {candidateResults.map(({ job, result }) => {
                const difference =
                  baselineRealNet === null ||
                  result.realNetMonthly === null
                    ? null
                    : result.realNetMonthly - baselineRealNet

                return (
                  <td key={job.id}>
                    <strong>{money(result.realNetMonthly)}</strong>
                    <div>/ month</div>
                    <div>{signedMoney(difference)} vs current</div>
                  </td>
                )
              })}
            </tr>

            <tr>
              <th>What changes</th>
              <td>Baseline</td>

              {candidateResults.map(({ job, result }) => {
                const difference =
                  baselineRealNet === null ||
                  result.realNetMonthly === null
                    ? null
                    : result.realNetMonthly - baselineRealNet

                return (
                  <td key={job.id}>
                    {signedMoney(difference)} / month
                  </td>
                )
              })}
            </tr>

            <tr>
              <th>Total time</th>
              <td>
                <strong>
                  {hours(
                    notWorking
                      ? 0
                      : currentResult?.time.totalTimeHoursWeekly ?? null,
                  )}
                </strong>
                <div>Baseline</div>
              </td>

              {candidateResults.map(({ job, result }) => {
                const candidateTime =
                  result.time.totalTimeHoursWeekly

                const difference =
                  baselineTime === null || candidateTime === null
                    ? null
                    : candidateTime - baselineTime

                return (
                  <td key={job.id}>
                    <strong>{hours(candidateTime)}</strong>
                    <div>{signedHours(difference)} vs current</div>
                  </td>
                )
              })}
            </tr>

            <tr>
              <th>Effective net</th>
              <td>
                <strong>
                  {notWorking ||
                  currentResult?.effectiveNetPerHour == null
                    ? 'No data'
                    : `${money(currentResult.effectiveNetPerHour)} / hour`}
                </strong>
                <div>Baseline</div>
              </td>

              {candidateResults.map(({ job, result }) => (
                <td key={job.id}>
                  <strong>
                    {result.effectiveNetPerHour == null
                      ? 'No data'
                      : `${money(result.effectiveNetPerHour)} / hour`}
                  </strong>
                </td>
              ))}
            </tr>

            <tr>
              <th>Work pattern</th>
              <td>
                {notWorking
                  ? 'Not working'
                  : currentResult?.workPattern.summary ?? 'No data'}
              </td>

              {candidateResults.map(({ job, result }) => (
                <td key={job.id}>
                  {result.workPattern.summary ?? 'No data'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default ComparisonScreen
