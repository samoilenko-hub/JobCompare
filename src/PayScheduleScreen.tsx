import type { JobDraft } from './types/formDraft_v3'

type PayScheduleScreenProps = {
  onBack: () => void
  onContinue: () => void
  jobDraft: JobDraft
  setJobDraft: (draft: JobDraft) => void
}

function PayScheduleScreen({
  onBack,
  onContinue,
  jobDraft,
  setJobDraft,
}: PayScheduleScreenProps) {
  return (
    <main>
      <h1>Pay & schedule</h1>

      <div>
        <label>
          Pay basis
          <select
            value={jobDraft.payBasis}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, payBasis: event.target.value })
            }
          >
            <option value="hour">Per hour</option>
            <option value="day">Per day</option>
            <option value="week">Per week</option>
            <option value="month">Per month</option>
            <option value="year">Per year</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Pay amount (£)
          <input
            type="number"
            min="0"
            step="0.01"
            value={jobDraft.payAmount}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, payAmount: event.target.value })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Advertised hours per week
          <input
            type="number"
            min="0"
            step="0.5"
            value={jobDraft.advertisedHoursPerWeek}
            onChange={(event) =>
              setJobDraft({
                ...jobDraft,
                advertisedHoursPerWeek: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Expected actual hours per week
          <input
            type="number"
            min="0"
            step="0.5"
            value={jobDraft.actualHoursPerWeek}
            onChange={(event) =>
              setJobDraft({
                ...jobDraft,
                actualHoursPerWeek: event.target.value,
              })
            }
          />
        </label>
      </div>

      <div>
        <label>
          Shifts per week
          <input
            type="number"
            min="0"
            max="7"
            step="1"
            value={jobDraft.shiftsPerWeek}
            onChange={(event) =>
              setJobDraft({ ...jobDraft, shiftsPerWeek: event.target.value })
            }
          />
        </label>
      </div>

      <div>
        <div>Working days</div>

        {[
          ['mon', 'Mon'],
          ['tue', 'Tue'],
          ['wed', 'Wed'],
          ['thu', 'Thu'],
          ['fri', 'Fri'],
          ['sat', 'Sat'],
          ['sun', 'Sun'],
        ].map(([value, label]) => (
          <label key={value}>
            <input
              type="checkbox"
              checked={jobDraft.workingDays.includes(value)}
              onChange={(event) => {
                const workingDays = event.target.checked
                  ? [...jobDraft.workingDays, value]
                  : jobDraft.workingDays.filter((day) => day !== value)

                setJobDraft({ ...jobDraft, workingDays })
              }}
            />
            {label}
          </label>
        ))}
      </div>

      <fieldset>
        <legend>Schedule details</legend>

        <label>
          <input
            type="radio"
            name="scheduleInputMode"
            checked={jobDraft.scheduleInputMode === 'hours'}
            onChange={() =>
              setJobDraft({
                ...jobDraft,
                scheduleInputMode: 'hours',
                shift: '',
              })
            }
          />
          I know the working hours
        </label>

        <label>
          <input
            type="radio"
            name="scheduleInputMode"
            checked={jobDraft.scheduleInputMode === 'shift'}
            onChange={() =>
              setJobDraft({
                ...jobDraft,
                scheduleInputMode: 'shift',
                startTime: '',
                endTime: '',
              })
            }
          />
          I only know the shift
        </label>
      </fieldset>

      {jobDraft.scheduleInputMode === 'hours' ? (
        <>
          <div>
            <label>
              Start time
              <input
                type="time"
                value={jobDraft.startTime}
                onChange={(event) =>
                  setJobDraft({
                    ...jobDraft,
                    startTime: event.target.value,
                  })
                }
              />
            </label>
          </div>

          <div>
            <label>
              End time
              <input
                type="time"
                value={jobDraft.endTime}
                onChange={(event) =>
                  setJobDraft({
                    ...jobDraft,
                    endTime: event.target.value,
                  })
                }
              />
            </label>
          </div>
        </>
      ) : (
        <div>
          <label>
            Shift
            <select
              value={jobDraft.shift}
              onChange={(event) =>
                setJobDraft({
                  ...jobDraft,
                  shift: event.target.value,
                })
              }
            >
              <option value="">Select</option>
              <option value="early">Early</option>
              <option value="day">Day</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
              <option value="variable">Variable</option>
            </select>
          </label>
        </div>
      )}

      <button type="button" onClick={onBack}>Back</button>
      <button type="button" onClick={onContinue}>Continue</button>
    </main>
  )
}

export default PayScheduleScreen
