import type { HomeTravelDraft } from './types/formDraft_v3'

type HomeTravelScreenProps = {
  homeTravelDraft: HomeTravelDraft
  setHomeTravelDraft: (draft: HomeTravelDraft) => void
  onBack: () => void
  onContinue: () => void
  currentStatus: 'employed' | 'self_employed' | 'not_working' | ''
}

function HomeTravelScreen({
  homeTravelDraft,
  setHomeTravelDraft,
  onBack,
  onContinue,
  currentStatus,
}: HomeTravelScreenProps) {
  return (
    <main>
      <h1>Home & travel</h1>

      <div>
        <label>
          Home postcode
          <input
            type="text"
            value={homeTravelDraft.homePostcode}
            onChange={(event) =>
              setHomeTravelDraft({
                ...homeTravelDraft,
                homePostcode: event.target.value,
              })
            }
            placeholder="e.g. CF42 6ED"
          />
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={homeTravelDraft.hasCar}
            onChange={(event) =>
              setHomeTravelDraft({
                ...homeTravelDraft,
                hasCar: event.target.checked,
              })
            }
          />
          {currentStatus === 'not_working'
            ? 'I am willing to use a car for commuting'
            : 'I use a car for commuting'}
        </label>
      </div>

      {homeTravelDraft.hasCar && (
        <>
          <div>
            <label>
              Fuel type
              <select
                value={homeTravelDraft.fuelType}
                onChange={(event) =>
                  setHomeTravelDraft({
                    ...homeTravelDraft,
                    fuelType: event.target.value,
                  })
                }
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              Fuel consumption (L/100 km)
              <input
                type="number"
                min="0"
                step="0.1"
                value={homeTravelDraft.fuelConsumptionLitresPer100Km}
                onChange={(event) =>
                  setHomeTravelDraft({
                    ...homeTravelDraft,
                    fuelConsumptionLitresPer100Km: event.target.value,
                  })
                }
                placeholder="e.g. 10"
              />
            </label>
          </div>
        </>
      )}

      <button type="button" onClick={onBack}>
        Back
      </button>

      <button type="button" onClick={onContinue}>
        Continue
      </button>
    </main>
  )
}

export default HomeTravelScreen
