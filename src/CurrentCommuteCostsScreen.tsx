import type { CurrentJobDraft } from './types/formDraft_v3'

type CurrentCommuteCostsScreenProps = {
  currentJobDraft: CurrentJobDraft
  setCurrentJobDraft: (draft: CurrentJobDraft) => void
  onBack: () => void
  onContinue: () => void
}

function CurrentCommuteCostsScreen({
  currentJobDraft,
  setCurrentJobDraft,
  onBack,
  onContinue,
}: CurrentCommuteCostsScreenProps) {
  const update = (field: keyof CurrentJobDraft, value: string) => {
    setCurrentJobDraft({
      ...currentJobDraft,
      [field]: value,
    })
  }

  const addWorkCost = () => {
    setCurrentJobDraft({
      ...currentJobDraft,
      additionalWorkCosts: [
        ...currentJobDraft.additionalWorkCosts,
        {
          id: crypto.randomUUID(),
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
    value: string
  ) => {
    setCurrentJobDraft({
      ...currentJobDraft,
      additionalWorkCosts: currentJobDraft.additionalWorkCosts.map((cost) =>
        cost.id === id
          ? {
              ...cost,
              [field]: value,
            }
          : cost
      ),
    })
  }

  const removeWorkCost = (id: string) => {
    setCurrentJobDraft({
      ...currentJobDraft,
      additionalWorkCosts: currentJobDraft.additionalWorkCosts.filter(
        (cost) => cost.id !== id
      ),
    })
  }

  const hasCommute = currentJobDraft.commuteMethod !== 'remote'

  return (
    <main>
      <h1>Your current commute & costs</h1>

      <div>
        <label>
          How do you get to work?
          <select
            value={currentJobDraft.commuteMethod}
            onChange={(event) =>
              update('commuteMethod', event.target.value)
            }
          >
            <option value="car">Car</option>
            <option value="walk">Walking</option>
            <option value="remote">Remote / work from home</option>
          </select>
        </label>
      </div>

      {hasCommute && (
        <>
          <div>
            <label>
              One-way distance (miles)
              <input
                type="number"
                min="0"
                step="0.1"
                value={currentJobDraft.commuteDistanceMiles}
                onChange={(event) =>
                  update('commuteDistanceMiles', event.target.value)
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
                value={currentJobDraft.commuteTimeMinutes}
                onChange={(event) =>
                  update('commuteTimeMinutes', event.target.value)
                }
              />
            </label>
          </div>

          {currentJobDraft.commuteMethod === 'car' && (
            <div>
              <label>
                Parking (£ per workday)
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentJobDraft.parkingPerWorkday}
                  onChange={(event) =>
                    update('parkingPerWorkday', event.target.value)
                  }
                />
              </label>
            </div>
          )}
        </>
      )}

      <section>
        <h2>Additional work costs</h2>

        <p>
          Add costs that are directly related to doing this job. Leave empty if
          there are none.
        </p>

        {currentJobDraft.additionalWorkCosts.map((cost) => (
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

            <button
              type="button"
              onClick={() => removeWorkCost(cost.id)}
            >
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
            checked={currentJobDraft.routeFuelEnabled}
            onChange={(event) =>
              setCurrentJobDraft({
                ...currentJobDraft,
                routeFuelEnabled: event.target.checked,
              })
            }
          />
          This job involves additional driving during the workday
        </label>

        {currentJobDraft.routeFuelEnabled && (
          <div>
            <label>
              Route distance per workday (miles)
              <input
                type="number"
                min="0"
                step="1"
                value={currentJobDraft.routeDistanceMilesPerWorkday}
                onChange={(event) =>
                  update('routeDistanceMilesPerWorkday', event.target.value)
                }
              />
            </label>

            <label>
              Fuel type
              <select
                value={currentJobDraft.routeFuelType}
                onChange={(event) =>
                  setCurrentJobDraft({
                    ...currentJobDraft,
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
                value={currentJobDraft.routeFuelConsumptionLitresPer100Km}
                onChange={(event) =>
                  update(
                    'routeFuelConsumptionLitresPer100Km',
                    event.target.value
                  )
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

      <button type="button" onClick={onBack}>
        Back
      </button>

      <button type="button" onClick={onContinue}>
        Continue
      </button>
    </main>
  )
}

export default CurrentCommuteCostsScreen
