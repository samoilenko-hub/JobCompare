import { useState } from 'react'
import { buildRouteFuelCost } from './calculations/costs_v3'
import type {
  ContractType,
  Job,
  PayBasis,
  Weekday,
  WorkCost,
} from './types/job_v3'
import type { CalculationResult } from './types/results_v3'
import { calculateJob } from './calculations/calculateJob_v3'
import { defaultRules } from './rules/defaultRules_v3'
import './ComparisonScreen.css'

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
  onRemoveJob: (jobId: string) => void
  onUpdateJob: (job: Job) => void
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

const moneyDifferenceColour = (value: number | null) => {
  if (value === null || value === 0) return 'inherit'
  return value > 0 ? 'green' : 'red'
}

const timeDifferenceColour = (value: number | null) => {
  if (value === null || value === 0) return 'inherit'
  return value > 0 ? 'red' : 'green'
}

const advertisedPay = (job: Job) => {
  if (job.pay.kind === 'employed') {
    return `${money(job.pay.amount)} / ${job.pay.basis}`
  }

  return `${money(job.pay.revenueAmount)} / ${job.pay.revenueFrequency}`
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

const weekdays: [Weekday, string][] = [
  ['mon', 'Mon'],
  ['tue', 'Tue'],
  ['wed', 'Wed'],
  ['thu', 'Thu'],
  ['fri', 'Fri'],
  ['sat', 'Sat'],
  ['sun', 'Sun'],
]

function JobEditModal({
  job,
  onCancel,
  onSave,
}: {
  job: Job
  onCancel: () => void
  onSave: (job: Job) => void
}) {
  const [draft, setDraft] = useState<Job>(() => ({
    ...job,
    contract: job.contract ? { ...job.contract } : undefined,
    schedule: { ...job.schedule, workingDays: [...job.schedule.workingDays] },
    workplace: { ...job.workplace },
    commute: job.commute ? { ...job.commute } : undefined,
    vehicle: job.vehicle ? { ...job.vehicle } : undefined,
    pay: { ...job.pay },
    workCosts: job.workCosts.map((cost) => ({ ...cost })),
  }))

  const setBasic = (
    field: 'position' | 'companyName',
    value: string,
  ) => {
    setDraft({ ...draft, [field]: value })
  }

  const updateSchedule = (changes: Partial<Job['schedule']>) => {
    setDraft({ ...draft, schedule: { ...draft.schedule, ...changes } })
  }

  const updateCommute = (changes: Partial<NonNullable<Job['commute']>>) => {
    const commute = draft.commute ?? {
      mode: 'car' as const,
      distanceMilesOneWay: undefined,
      travelMinutesOneWay: undefined,
      parkingCostPerWorkday: 0,
    }
    setDraft({ ...draft, commute: { ...commute, ...changes } })
  }

  const updatePay = (changes: Partial<Job['pay']>) => {
    setDraft({ ...draft, pay: { ...draft.pay, ...changes } as Job['pay'] })
  }

  const updateCost = (
    id: string,
    changes: Partial<WorkCost>,
  ) => {
    setDraft({
      ...draft,
      workCosts: draft.workCosts.map((cost) =>
        cost.id === id ? { ...cost, ...changes } : cost,
      ),
    })
  }

  const updateRouteFuelCost = (
    id: string,
    changes: Partial<WorkCost>,
  ) => {
    const existing = draft.workCosts.find((cost) => cost.id === id)
    if (!existing || existing.type !== 'route_fuel') return

    const updated = { ...existing, ...changes }

    const distance = updated.routeDistanceMilesPerWorkday
    const consumption = updated.consumptionLitresPer100Km
    const fuelType = updated.fuelType

    if (
      distance !== undefined &&
      consumption !== undefined &&
      distance >= 0 &&
      consumption > 0 &&
      (fuelType === 'petrol' || fuelType === 'diesel')
    ) {
      const fuelPrice =
        fuelType === 'petrol'
          ? defaultRules.assumptions.fuelPrices.petrolPerLitre
          : defaultRules.assumptions.fuelPrices.dieselPerLitre

      const recalculated = buildRouteFuelCost(
        updated.id,
        distance,
        consumption,
        fuelPrice,
        defaultRules,
        fuelType,
      )

      updateCost(id, {
        ...updated,
        amount: recalculated.amount,
      })
    } else {
      updateCost(id, updated)
    }
  }

  const addCost = () => {
    setDraft({
      ...draft,
      workCosts: [
        ...draft.workCosts,
        {
          id: `cost-${Date.now()}`,
          type: 'other',
          description: '',
          amount: 0,
          frequency: 'month',
          source: 'user_entered',
        },
      ],
    })
  }

  const removeCost = (id: string) => {
    setDraft({
      ...draft,
      workCosts: draft.workCosts.filter((cost) => cost.id !== id),
    })
  }

  const toggleDay = (day: Weekday) => {
    const workingDays = draft.schedule.workingDays.includes(day)
      ? draft.schedule.workingDays.filter((item) => item !== day)
      : [...draft.schedule.workingDays, day]

    updateSchedule({ workingDays })
  }

  const save = () => {
    const cleanedCosts = draft.workCosts
      .filter((cost) => (cost.description ?? '').trim() !== '' && Number.isFinite(cost.amount))
      .map((cost) => ({
        ...cost,
        description: cost.description?.trim(),
        amount: Number(cost.amount),
      }))

    onSave({ ...draft, workCosts: cleanedCosts })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-job-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          width: 'min(760px, 100%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24,
          borderRadius: 8,
        }}
      >
        <h2 id="edit-job-title">Edit job</h2>

        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            Position
            <input
              type="text"
              value={draft.position}
              onChange={(e) => setBasic('position', e.target.value)}
            />
          </label>

          <label>
            Company
            <input
              type="text"
              value={draft.companyName ?? ''}
              onChange={(e) => setBasic('companyName', e.target.value)}
            />
          </label>

          <label>
            Location
            <input
              type="text"
              value={draft.workplace.displayLocation ?? ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  workplace: {
                    ...draft.workplace,
                    displayLocation: e.target.value,
                    postcodeOrAddress: e.target.value,
                  },
                })
              }
            />
          </label>

          <label>
            Employment
            <select
              value={draft.employmentType}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  employmentType: e.target.value as Job['employmentType'],
                })
              }
            >
              <option value="employed">Employed</option>
              <option value="self_employed">Self-employed</option>
            </select>
          </label>

          <label>
            Contract
            <select
              value={draft.contract?.type ?? ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  contract: e.target.value
                    ? { type: e.target.value as ContractType }
                    : undefined,
                })
              }
            >
              <option value="">Not specified</option>
              <option value="permanent">Permanent</option>
              <option value="fixed_term">Fixed-term</option>
              <option value="temporary">Temporary</option>
            </select>
          </label>

          <h3>Pay</h3>

          <label>
            Pay basis
            <select
              value={draft.pay.kind === 'self_employed'
                ? draft.pay.revenueFrequency
                : draft.pay.basis}
              onChange={(e) => {
                const value = e.target.value as PayBasis
                if (draft.employmentType === 'self_employed') {
                  setDraft({
                    ...draft,
                    pay: {
                      kind: 'self_employed',
                      revenueAmount: draft.pay.kind === 'self_employed'
                        ? draft.pay.revenueAmount
                        : draft.pay.amount,
                      revenueFrequency: value === 'hour' ? 'week' : value,
                    },
                  })
                } else {
                  setDraft({
                    ...draft,
                    pay: {
                      kind: 'employed',
                      basis: value,
                      amount: draft.pay.kind === 'employed'
                        ? draft.pay.amount
                        : draft.pay.revenueAmount,
                    },
                  })
                }
              }}
            >
              {draft.employmentType === 'self_employed' ? (
                <>
                  <option value="day">Per day</option>
                  <option value="week">Per week</option>
                  <option value="month">Per month</option>
                  <option value="year">Per year</option>
                </>
              ) : (
                <>
                  <option value="hour">Per hour</option>
                  <option value="day">Per day</option>
                  <option value="week">Per week</option>
                  <option value="month">Per month</option>
                  <option value="year">Per year</option>
                </>
              )}
            </select>
          </label>

          <label>
            Pay amount (£)
            <input
              type="number"
              min="0"
              step="0.01"
              value={
                draft.pay.kind === 'self_employed'
                  ? draft.pay.revenueAmount
                  : draft.pay.amount
              }
              onChange={(e) => {
                const amount = Number(e.target.value)
                updatePay(
                  draft.pay.kind === 'self_employed'
                    ? { revenueAmount: amount }
                    : { amount },
                )
              }}
            />
          </label>

          <h3>Schedule</h3>

          <label>
            Advertised hours per week
            <input
              type="number"
              min="0"
              step="0.5"
              value={draft.schedule.advertisedHoursPerWeek}
              onChange={(e) =>
                updateSchedule({ advertisedHoursPerWeek: Number(e.target.value) })
              }
            />
          </label>

          <label>
            Expected actual hours per week
            <input
              type="number"
              min="0"
              step="0.5"
              value={draft.schedule.expectedActualHoursPerWeek ?? ''}
              onChange={(e) =>
                updateSchedule({
                  expectedActualHoursPerWeek:
                    e.target.value === '' ? undefined : Number(e.target.value),
                })
              }
            />
          </label>

          <label>
            Shifts per week
            <input
              type="number"
              min="0"
              max="7"
              step="1"
              value={draft.schedule.shiftsPerWeek}
              onChange={(e) =>
                updateSchedule({ shiftsPerWeek: Number(e.target.value) })
              }
            />
          </label>

          <div>
            <div>Working days</div>
            {weekdays.map(([value, label]) => (
              <label key={value} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  checked={draft.schedule.workingDays.includes(value)}
                  onChange={() => toggleDay(value)}
                />
                {label}
              </label>
            ))}
          </div>

          <label>
            Start time
            <input
              type="time"
              value={draft.schedule.startTime ?? ''}
              onChange={(e) => updateSchedule({ startTime: e.target.value || undefined })}
            />
          </label>

          <label>
            End time
            <input
              type="time"
              value={draft.schedule.endTime ?? ''}
              onChange={(e) => updateSchedule({ endTime: e.target.value || undefined })}
            />
          </label>

          <h3>Commute</h3>

          <label>
            How do you get to work?
            <select
              value={draft.workplace.type === 'remote'
                ? 'remote'
                : draft.commute?.mode ?? 'car'}
              onChange={(e) => {
                if (e.target.value === 'remote') {
                  setDraft({ ...draft, workplace: { ...draft.workplace, type: 'remote' }, commute: undefined })
                } else {
                  setDraft({
                    ...draft,
                    workplace: { ...draft.workplace, type: 'on_site' },
                    commute: {
                      ...(draft.commute ?? {}),
                      mode: e.target.value as NonNullable<Job['commute']>['mode'],
                    },
                  })
                }
              }}
            >
              <option value="car">Car</option>
              <option value="walk">Walking</option>
              <option value="public_transport">Public transport</option>
              <option value="remote">Remote / work from home</option>
            </select>
          </label>

          {draft.workplace.type !== 'remote' && (
            <>
              <label>
                One-way distance (miles)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={draft.commute?.distanceMilesOneWay ?? ''}
                  onChange={(e) =>
                    updateCommute({
                      distanceMilesOneWay:
                        e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                />
              </label>

              <label>
                One-way travel time (minutes)
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={draft.commute?.travelMinutesOneWay ?? ''}
                  onChange={(e) =>
                    updateCommute({
                      travelMinutesOneWay:
                        e.target.value === '' ? undefined : Number(e.target.value),
                    })
                  }
                />
              </label>

              {draft.commute?.mode === 'car' && (
                <label>
                  Parking (£ per workday)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={draft.commute.parkingCostPerWorkday ?? ''}
                    onChange={(e) =>
                      updateCommute({
                        parkingCostPerWorkday:
                          e.target.value === '' ? undefined : Number(e.target.value),
                      })
                    }
                  />
                </label>
              )}
            </>
          )}

          <h3>Vehicle</h3>

          <label>
            Fuel type
            <select
              value={draft.vehicle?.fuelType ?? 'diesel'}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  vehicle: {
                    ...(draft.vehicle ?? { consumptionLitresPer100Km: undefined }),
                    fuelType: e.target.value as NonNullable<Job['vehicle']>['fuelType'],
                  },
                })
              }
            >
              <option value="diesel">Diesel</option>
              <option value="petrol">Petrol</option>
              <option value="electric">Electric</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label>
            Vehicle consumption (L/100 km)
            <input
              type="number"
              min="0"
              step="0.1"
              value={draft.vehicle?.consumptionLitresPer100Km ?? ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  vehicle: {
                    ...(draft.vehicle ?? { fuelType: 'diesel' }),
                    consumptionLitresPer100Km:
                      e.target.value === '' ? undefined : Number(e.target.value),
                  },
                })
              }
            />
          </label>

          <h3>Additional work costs</h3>

          {draft.workCosts.map((cost) => (
            <div
              key={cost.id}
              style={{
                border: '1px solid #ccc',
                padding: 10,
                display: 'grid',
                gap: 8,
              }}
            >
              {cost.type === 'route_fuel' ? (
                <>
                  <strong>Route fuel</strong>

                  <label>
                    Route distance per workday (miles)
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={cost.routeDistanceMilesPerWorkday ?? ''}
                      onChange={(e) =>
                        updateRouteFuelCost(cost.id, {
                          routeDistanceMilesPerWorkday:
                            e.target.value === '' ? undefined : Number(e.target.value),
                        })
                      }
                    />
                  </label>

                  <label>
                    Fuel type
                    <select
                      value={cost.fuelType ?? 'diesel'}
                      onChange={(e) =>
                        updateRouteFuelCost(cost.id, {
                          fuelType: e.target.value as 'petrol' | 'diesel',
                        })
                      }
                    >
                      <option value="diesel">Diesel</option>
                      <option value="petrol">Petrol</option>
                    </select>
                  </label>

                  <label>
                    Vehicle consumption (L/100 km)
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={cost.consumptionLitresPer100Km ?? ''}
                      onChange={(e) =>
                        updateRouteFuelCost(cost.id, {
                          consumptionLitresPer100Km:
                            e.target.value === '' ? undefined : Number(e.target.value),
                        })
                      }
                    />
                  </label>

                  <div>
                    Calculated fuel cost: {money(cost.amount)} per workday
                  </div>
                </>
              ) : (
                <>
                  <label>
                    Description
                    <input
                      type="text"
                      value={cost.description ?? ''}
                      onChange={(e) =>
                        updateCost(cost.id, { description: e.target.value })
                      }
                    />
                  </label>

                  <label>
                    Amount (£)
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={cost.amount}
                      onChange={(e) =>
                        updateCost(cost.id, { amount: Number(e.target.value) })
                      }
                    />
                  </label>

                  <label>
                    Frequency
                    <select
                      value={cost.frequency}
                      onChange={(e) =>
                        updateCost(cost.id, {
                          frequency: e.target.value as WorkCost['frequency'],
                        })
                      }
                    >
                      <option value="workday">Per workday</option>
                      <option value="week">Per week</option>
                      <option value="month">Per month</option>
                      <option value="year">Per year</option>
                    </select>
                  </label>
                </>
              )}

              <button type="button" onClick={() => removeCost(cost.id)}>
                Remove cost
              </button>
            </div>
          ))}

          <button type="button" onClick={addCost}>
            + Add a work-related cost
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" onClick={save}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}



function ComparisonScreen({
  currentJob,
  currentResult,
  currentStatus,
  userJobs,
  onAddJob,
  onRemoveJob,
  onUpdateJob,
  onEditCurrent,
}: ComparisonScreenProps) {
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)

  const selectableRow = (row: string) => ({
    className: selectedRow === row ? 'comparison-row-selected' : 'comparison-row',
    onClick: () =>
      setSelectedRow((current) => (current === row ? null : row)),
  })

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


        <div className="comparison-table-wrapper">
          <div className="comparison-table-scroll">
            <table className="comparison-table">
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
                  <div>
                    <button
                      type="button"
                      onClick={() => setEditingJob(job)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveJob(job.id)}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr {...selectableRow('location')}>
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

            <tr {...selectableRow('employment')}>
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

            <tr {...selectableRow('contract')}>
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

            <tr {...selectableRow('gross-pay')}>
              <th>Gross pay</th>
              <td>
                <strong className="real-net-value">
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

            <tr {...selectableRow('work-costs')}>
              <th>Commute &amp; work costs</th>
              <td>
                <strong
                  style={
                    !notWorking &&
                    currentResult?.costs.totalWorkCostsMonthly != null &&
                    currentResult.costs.totalWorkCostsMonthly > 0
                      ? { color: 'red' }
                      : undefined
                  }
                >
                  {notWorking
                    ? money(0)
                    : currentResult?.costs.totalWorkCostsMonthly == null
                      ? 'No data'
                      : currentResult.costs.totalWorkCostsMonthly > 0
                        ? `−${money(currentResult.costs.totalWorkCostsMonthly)}`
                        : money(0)}
                </strong>
                <div>/ month</div>
              </td>

              {candidateResults.map(({ job, result }) => {
                const costs = result.costs.totalWorkCostsMonthly
                return (
                  <td key={job.id}>
                    <strong
                      style={
                        costs !== null && costs > 0
                          ? { color: 'red' }
                          : undefined
                      }
                    >
                      {costs === null
                        ? 'No data'
                        : costs > 0
                          ? `−${money(costs)}`
                          : money(0)}
                    </strong>
                    <div>/ month</div>
                  </td>
                )
              })}
            </tr>

            <tr
              {...selectableRow('real-net')}
              className={`real-net-row ${
                selectedRow === 'real-net'
                  ? 'comparison-row-selected'
                  : 'comparison-row'
              }`}
            >
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
                    <strong className="real-net-value">
                      {money(result.realNetMonthly)}
                    </strong>
                    <div>/ month</div>
                    <div
                      style={{
                        color: moneyDifferenceColour(difference),
                        fontWeight: 'bold',
                        fontSize: '0.8em',
                      }}
                    >
                      {signedMoney(difference)} vs current
                    </div>
                  </td>
                )
              })}
            </tr>

            

            <tr {...selectableRow('total-time')}>
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
                    <div
                      style={{
                        color: timeDifferenceColour(difference),
                        fontWeight: 'bold',
                        fontSize: '0.8em',
                      }}
                    >
                      {signedHours(difference)} vs current
                    </div>
                  </td>
                )
              })}
            </tr>

            <tr {...selectableRow('advertised-pay')}>
              <th>Advertised pay</th>
              <td>
                <strong>
                  {notWorking || !currentJob
                    ? 'No data'
                    : advertisedPay(currentJob)}
                </strong>
              </td>

              {candidateResults.map(({ job }) => (
                <td key={job.id}>
                  <strong>{advertisedPay(job)}</strong>
                </td>
              ))}
            </tr>

            <tr {...selectableRow('effective-net')}>
              <th
                style={{
                  fontWeight: 'bold',
                  borderTop: '2px solid #6b7280',
                  borderBottom: '2px solid #6b7280',
                }}
              >
                Effective net
              </th>
              <td
                style={{
                  borderTop: '2px solid #6b7280',
                  borderBottom: '2px solid #6b7280',
                }}
              >
                <strong style={{ fontSize: '1.15em' }}>
                  {notWorking ||
                  currentResult?.effectiveNetPerHour == null
                    ? 'No data'
                    : `${money(currentResult.effectiveNetPerHour)} / hour`}
                </strong>
                <div style={{ fontSize: '0.8em' }}>Baseline</div>
              </td>

              {candidateResults.map(({ job, result }) => {
                const difference =
                  notWorking ||
                  currentResult?.effectiveNetPerHour == null ||
                  result.effectiveNetPerHour == null
                    ? null
                    : result.effectiveNetPerHour -
                      currentResult.effectiveNetPerHour

                return (
                  <td
                    key={job.id}
                    style={{
                      borderTop: '2px solid #6b7280',
                      borderBottom: '2px solid #6b7280',
                    }}
                  >
                    <strong style={{ fontSize: '1.15em' }}>
                      {result.effectiveNetPerHour == null
                        ? 'No data'
                        : `${money(result.effectiveNetPerHour)} / hour`}
                    </strong>

                    {difference !== null && (
                      <div
                        style={{
                          fontSize: '0.8em',
                          color: moneyDifferenceColour(difference),
                          fontWeight: 'bold',
                        }}
                      >
                        {signedMoney(difference)} / hour vs current
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>

            <tr {...selectableRow('work-pattern')}>
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
            <div className="comparison-scroll-spacer" />
          </div>
        </div>
      </div>

      {editingJob && (
        <JobEditModal
          job={editingJob}
          onCancel={() => setEditingJob(null)}
          onSave={(updatedJob) => {
            onUpdateJob(updatedJob)
            setEditingJob(null)
          }}
        />
      )}
    </main>
  )
}

export default ComparisonScreen
