import type { JobDraft } from './types/formDraft_v3'

type CommuteCostsScreenProps = {
  onBack: () => void
  onCompare: () => void
  jobDraft: JobDraft
  setJobDraft: (draft: JobDraft) => void
}

function CommuteCostsScreen({
  onBack,
  onCompare,
  jobDraft,
  setJobDraft,
}: CommuteCostsScreenProps) {
  const addWorkCost = () => {
    setJobDraft({
      ...jobDraft,
      additionalWorkCosts: [
        ...jobDraft.additionalWorkCosts,
        {
          id: `cost-${Date.now()}`,
          description: '',
          amount: '',
          frequency: 'month',
        },
      ],
    })
  }

  const updateWorkCost = (
    id: string,
    field: 'description' | 'amount' | 'frequency',
    value: string,
  ) => {
    setJobDraft({
      ...jobDraft,
      additionalWorkCosts: jobDraft.additionalWorkCosts.map((cost) =>
        cost.id === id ? { ...cost, [field]: value } : cost,
      ),
    })
  }

  const removeWorkCost = (id: string) => {
    setJobDraft({
      ...jobDraft,
      additionalWorkCosts: jobDraft.additionalWorkCosts.filter(
        (cost) => cost.id !== id,
      ),
    })
  }

  return (
    <main>
      <h1>Commute & costs</h1>

      <div>
        <label>
          How do you get to work?
          <select
            value={jobDraft.commuteMethod}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, commuteMethod: event.target.value })
            }
          >
            <option value="car">Car</option>
            <option value="walk">Walking</option>
            <option value="remote">Remote / work from home</option>
          </select>
        </label>
      </div>

      {jobDraft.commuteMethod !== 'remote' && (
        <>
          <div>
            <label>
              One-way distance (miles)
              <input
                type="number"
                min="0"
                step="0.1"
                value={jobDraft.commuteDistanceMiles}
                onChange={(event) =>
                  setJobDraft({
                    ...jobDraft,
                    commuteDistanceMiles: event.target.value,
                  })
                }
              />
            </label>
          </div>

          <div>
            <label>
              One-way travel time (minutes)
              <input
                type="number"
                min="0"
                step="1"
                value={jobDraft.commuteTimeMinutes}
                onChange={(event) =>
                  setJobDraft({
                    ...jobDraft,
                    commuteTimeMinutes: event.target.value,
                  })
                }
              />
            </label>
          </div>
        </>
      )}

      {jobDraft.commuteMethod === 'car' && (
        <div>
          <label>
            Parking (£ per workday)
            <input
              type="number"
              min="0"
              step="0.01"
              value={jobDraft.parkingPerWorkday}
              onChange={(event) =>
                setJobDraft({
                  ...jobDraft,
                  parkingPerWorkday: event.target.value,
                })
              }
            />
          </label>
        </div>
      )}

      <section>
        <h2>Additional work costs</h2>
        <p>
          Add costs that are directly related to doing this job. Leave empty if
          there are none.
        </p>

        {jobDraft.additionalWorkCosts.map((cost) => (
          <div key={cost.id}>
            <label>
              Cost
              <input
                type="text"
                placeholder="e.g. Van rental, work clothing, tools"
                value={cost.description}
                onChange={(event) =>
                  updateWorkCost(cost.id, 'description', event.target.value)
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
                onChange={(event) =>
                  updateWorkCost(cost.id, 'amount', event.target.value)
                }
              />
            </label>

            <label>
              Frequency
              <select
                value={cost.frequency}
                onChange={(event) =>
                  updateWorkCost(cost.id, 'frequency', event.target.value)
                }
              >
                <option value="workday">Per workday</option>
                <option value="week">Per week</option>
                <option value="month">Per month</option>
                <option value="year">Per year</option>
              </select>
            </label>

            <button type="button" onClick={() => removeWorkCost(cost.id)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button" onClick={addWorkCost}>
          + Add a work-related cost
        </button>
      </section>

      <section>
        <h2>Calculate route fuel</h2>
        <label>
          <input
            type="checkbox"
            checked={jobDraft.routeFuelEnabled}
            onChange={(event) =>
              setJobDraft({
                ...jobDraft,
                routeFuelEnabled: event.target.checked,
              })
            }
          />
          This job involves additional driving during the workday
        </label>

        {jobDraft.routeFuelEnabled && (
          <div>
            <label>
              Route distance per workday (miles)
              <input
                type="number"
                min="0"
                step="1"
                value={jobDraft.routeDistanceMilesPerWorkday}
                onChange={(event) =>
                  setJobDraft({
                    ...jobDraft,
                    routeDistanceMilesPerWorkday: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Fuel type
              <select
                value={jobDraft.routeFuelType}
                onChange={(event) =>
                  setJobDraft({
                    ...jobDraft,
                    routeFuelType: event.target.value as 'petrol' | 'diesel',
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
                value={jobDraft.routeFuelConsumptionLitresPer100Km}
                onChange={(event) =>
                  setJobDraft({
                    ...jobDraft,
                    routeFuelConsumptionLitresPer100Km: event.target.value,
                  })
                }
              />
            </label>

            <p>
              Fuel cost will be calculated automatically from the route,
              vehicle consumption and the current fuel-price assumption.
            </p>
          </div>
        )}
      </section>

      <button type="button" onClick={onBack}>Back</button>
      <button type="button" onClick={onCompare}>Compare</button>
    </main>
  )
}

export default CommuteCostsScreen
