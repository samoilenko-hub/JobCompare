import { calculateJob } from './calculations/calculateJob_v3'
import {
  buildBaselineDecisionSummary,
  buildDecisionSummary,
  compareJobs,
} from './calculations/compareJobs_v3'
import { defaultRules } from './rules/defaultRules_v3'
import { referenceJobsV3 } from './testData/referenceJobs_v3'

function formatMoney(value: number | null) {
  return value === null ? 'No data' : `£${value.toFixed(2)}`
}

function formatSignedMoney(value: number | null) {
  if (value === null) return 'No data'
  if (value === 0) return '—'
  return `${value > 0 ? '+' : '-'}£${Math.abs(value).toFixed(2)}`
}

function formatHours(value: number | null) {
  if (value === null) return 'No data'

  const totalMinutes = Math.round(value * 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes}m`
}

function formatSignedHours(value: number | null) {
  if (value === null) return 'No data'
  if (value === 0) return '—'

  return `${value > 0 ? '+' : '-'}${formatHours(Math.abs(value))}`
}

function comparisonColor(
  value: number | null,
  lowerIsBetter = false,
) {
  if (value === null || value === 0) return undefined

  const better = lowerIsBetter ? value < 0 : value > 0
  return better ? '#137333' : '#c5221f'
}

function App() {
  const calculated = referenceJobsV3.map((job) => ({
    job,
    result: calculateJob(job, defaultRules),
  }))

  const baseline = calculated[0]

  if (!baseline) {
    return <main>No reference data available.</main>
  }

  const columns = calculated.map(({ job, result }, index) => {
    const comparison =
      index === 0 ? null : compareJobs(result, baseline.result)

    const summary =
      comparison === null
        ? buildBaselineDecisionSummary(result)
        : buildDecisionSummary(result, comparison)

    return {
      job,
      summary,
      effectiveRateDifference:
        comparison?.effectiveNetPerHourDifference ?? null,
    }
  })

  return (
    <main
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '32px',
        minWidth: '1200px',
      }}
    >
      <h1>JobCompare</h1>
      <h2>Calculation Engine Reference Check</h2>

      <p>
        Reference scenarios calculated by the TypeScript engine and compared
        with the current job baseline.
      </p>

      <table
        style={{
          borderCollapse: 'collapse',
          marginTop: '24px',
          width: '100%',
        }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>Metric</th>
            {columns.map(({ job }) => (
              <th key={job.id} style={headerStyle}>
                {job.companyName}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td style={labelStyle}>Position</td>
            {columns.map(({ job }) => (
              <td key={job.id} style={cellStyle}>
                {job.position}
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelStyle}>Gross / month</td>
            {columns.map(({ job, summary }) => (
              <td key={job.id} style={cellStyle}>
                {formatMoney(summary.estimatedGrossMonthly)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelStyle}>Real Net / month</td>
            {columns.map(({ job, summary }) => (
              <td key={job.id} style={cellStyle}>
                {formatMoney(summary.realNetMonthly)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelStyle}>Income difference</td>
            {columns.map(({ job, summary }, index) => (
              <td
                key={job.id}
                style={{
                  ...cellStyle,
                  fontWeight: index === 0 ? 'normal' : 'bold',
                  color:
                    index === 0
                      ? undefined
                      : comparisonColor(summary.incomeDifferenceMonthly),
                }}
              >
                {index === 0
                  ? '—'
                  : formatSignedMoney(summary.incomeDifferenceMonthly)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelStyle}>Total Time / week</td>
            {columns.map(({ job, summary }) => (
              <td key={job.id} style={cellStyle}>
                {formatHours(summary.totalTimeHoursWeekly)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelStyle}>Time difference</td>
            {columns.map(({ job, summary }, index) => (
              <td
                key={job.id}
                style={{
                  ...cellStyle,
                  fontWeight: index === 0 ? 'normal' : 'bold',
                  color:
                    index === 0
                      ? undefined
                      : comparisonColor(
                          summary.timeDifferenceHoursWeekly,
                          true,
                        ),
                }}
              >
                {index === 0
                  ? '—'
                  : formatSignedHours(summary.timeDifferenceHoursWeekly)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelStyle}>Effective Net / hour</td>
            {columns.map(({ job, summary }) => (
              <td key={job.id} style={cellStyle}>
                {formatMoney(summary.effectiveNetPerHour)}
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelStyle}>Effective rate difference</td>
            {columns.map(
              ({ job, effectiveRateDifference }, index) => (
                <td
                  key={job.id}
                  style={{
                    ...cellStyle,
                    fontWeight: index === 0 ? 'normal' : 'bold',
                    color:
                      index === 0
                        ? undefined
                        : comparisonColor(effectiveRateDifference),
                  }}
                >
                  {index === 0
                    ? '—'
                    : formatSignedMoney(effectiveRateDifference)}
                </td>
              ),
            )}
          </tr>

          <tr>
            <td style={labelStyle}>Work Pattern</td>
            {columns.map(({ job, summary }) => (
              <td key={job.id} style={cellStyle}>
                {summary.workPattern}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </main>
  )
}

const headerStyle = {
  border: '1px solid #bbb',
  padding: '10px',
  textAlign: 'left' as const,
  background: '#f3f3f3',
}

const labelStyle = {
  ...headerStyle,
  fontWeight: 'bold',
}

const cellStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left' as const,
  verticalAlign: 'top' as const,
}

export default App
