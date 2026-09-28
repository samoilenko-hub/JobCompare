import type { JobDraft } from './types/formDraft_v3'

type AddJobScreenProps = {
  onBack: () => void
  onContinue: () => void
  jobDraft: JobDraft
  setJobDraft: (draft: JobDraft) => void
}

function AddJobScreen({
  onBack,
  onContinue,
  jobDraft,
  setJobDraft,
}: AddJobScreenProps) {
  return (
    <main>
      <h1>Add a job</h1>

      <div>
        <label>
          Position
          <input
            type="text"
            value={jobDraft.position}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, position: event.target.value })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Company
          <input
            type="text"
            value={jobDraft.company}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, company: event.target.value })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Location
          <input
            type="text"
            value={jobDraft.location}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, location: event.target.value })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Employment
          <select
            value={jobDraft.employmentType}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, employmentType: event.target.value })
            }
          >
            <option value="employed">Employed</option>
            <option value="self_employed">Self-employed</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Contract
          <select
            value={jobDraft.contractType}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, contractType: event.target.value })
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

export default AddJobScreen
