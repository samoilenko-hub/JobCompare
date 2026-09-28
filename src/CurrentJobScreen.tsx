import type { CurrentJobDraft } from './types/formDraft_v3'

type CurrentJobScreenProps = {
  currentJobDraft: CurrentJobDraft
  setCurrentJobDraft: (draft: CurrentJobDraft) => void
  onBack: () => void
  onContinue: () => void
}

function CurrentJobScreen({
  currentJobDraft,
  setCurrentJobDraft,
  onBack,
  onContinue,
}: CurrentJobScreenProps) {
  return (
    <main>
      <h1>Your current job</h1>

      <div>
        <label>
          Position
          <input
            type="text"
            value={currentJobDraft.position}
            onChange={(event) =>
              setCurrentJobDraft({
                ...currentJobDraft,
                position: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Company
          <input
            type="text"
            value={currentJobDraft.company}
            onChange={(event) =>
              setCurrentJobDraft({
                ...currentJobDraft,
                company: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Location
          <input
            type="text"
            value={currentJobDraft.location}
            onChange={(event) =>
              setCurrentJobDraft({
                ...currentJobDraft,
                location: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Contract
          <select
            value={currentJobDraft.contractType}
            onChange={(event) =>
              setCurrentJobDraft({
                ...currentJobDraft,
                contractType: event.target.value,
              })
            }
          >
            <option value="">Select</option>
            <option value="permanent">Permanent</option>
            <option value="temporary">Temporary</option>
            <option value="fixed_term">Fixed-term</option>
          </select>
        </label>
      </div>

      <button type="button" onClick={onBack}>Back</button>
      <button type="button" onClick={onContinue}>Continue</button>
    </main>
  )
}

export default CurrentJobScreen
