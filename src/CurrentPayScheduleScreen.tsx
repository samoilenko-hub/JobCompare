import type { CurrentJobDraft } from './types/formDraft_v3'

type CurrentCurrentPayScheduleScreenProps = {
  onBack: () => void
  onContinue: () => void
  currentJobDraft: CurrentJobDraft
  setCurrentJobDraft: (draft: CurrentJobDraft) => void
}

function CurrentPayScheduleScreen({
  onBack,
  onContinue,
  currentJobDraft,
  setCurrentJobDraft,
}: CurrentCurrentPayScheduleScreenProps) {
  return (
    <main>
      <h1>Your current pay & schedule</h1>

      <div>
        <label>
          Pay basis
          <select
            value={currentJobDraft.payBasis}
            onChange={(event) =>
              setCurrentJobDraft({ ...currentJobDraft, payBasis: event.target.value })
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
            value={currentJobDraft.payAmount}
            onChange={(event) =>
              setCurrentJobDraft({ ...currentJobDraft, payAmount: event.target.value })
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
            value={currentJobDraft.advertisedHoursPerWeek}
            onChange={(event) =>
              setCurrentJobDraft({
                ...currentJobDraft,
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
            value={currentJobDraft.actualHoursPerWeek}
            onChange={(event) =>
              setCurrentJobDraft({
                ...currentJobDraft,
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
            value={currentJobDraft.shiftsPerWeek}
            onChange={(event) =>
              setCurrentJobDraft({ ...currentJobDraft, shiftsPerWeek: event.target.value })
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
              checked={currentJobDraft.workingDays.includes(value)}
              onChange={(event) => {
                const workingDays = event.target.checked
                  ? [...currentJobDraft.workingDays, value]
                  : currentJobDraft.workingDays.filter((day) => day !== value)

                setCurrentJobDraft({ ...currentJobDraft, workingDays })
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
            name="currentScheduleInputMode"
            checked={currentJobDraft.scheduleInputMode === 'hours'}
            onChange={() =>
              setCurrentJobDraft({
                ...currentJobDraft,
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
            name="currentScheduleInputMode"
            checked={currentJobDraft.scheduleInputMode === 'shift'}
            onChange={() =>
              setCurrentJobDraft({
                ...currentJobDraft,
                scheduleInputMode: 'shift',
                startTime: '',
                endTime: '',
              })
            }
          />
          I only know the shift
        </label>
      </fieldset>

      {currentJobDraft.scheduleInputMode === 'hours' ? (
        <>
          <div>
            <label>
              Start time
              <input
                type="time"
                value={currentJobDraft.startTime}
                onChange={(event) =>
                  setCurrentJobDraft({
                    ...currentJobDraft,
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
                value={currentJobDraft.endTime}
                onChange={(event) =>
                  setCurrentJobDraft({
                    ...currentJobDraft,
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
              value={currentJobDraft.shift}
              onChange={(event) =>
                setCurrentJobDraft({
                  ...currentJobDraft,
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

export default CurrentPayScheduleScreen
