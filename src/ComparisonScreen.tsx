import type { Job } from './types/job_v3'
import type { CalculationResult } from './types/results_v3'

type CurrentStatus =
  | 'employed'
  | 'self_employed'
  | 'not_working'
  | ''

type ComparisonScreenProps = {
  currentJob: Job | null
  currentResult: CalculationResult | null
  currentStatus: CurrentStatus
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
  onEditCurrent,
}: ComparisonScreenProps) {
  const notWorking = currentStatus === 'not_working'

  return (
    <main>
      <button type="button" onClick={onEditCurrent}>
        Home
      </button>

      <h1>JobCompare</h1>
      <p>
        Compare what a job really gives you — money, time and work pattern.
      </p>

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
            </tr>

            <tr>
              <th>Contract</th>
              <td>
                {notWorking || !currentJob
                  ? '—'
                  : contractLabel(currentJob)}
              </td>
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
            </tr>

            <tr>
              <th>What changes</th>
              <td>Baseline</td>
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
            </tr>

            <tr>
              <th>Work pattern</th>
              <td>
                {notWorking
                  ? 'Not working'
                  : currentResult?.workPattern.summary ?? 'No data'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default ComparisonScreen
