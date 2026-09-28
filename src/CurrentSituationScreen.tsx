type CurrentStatus = 'employed' | 'self_employed' | 'not_working'

type CurrentSituationScreenProps = {
  status: CurrentStatus | ''
  onStatusChange: (status: CurrentStatus) => void
  onContinue: () => void
}

function CurrentSituationScreen({
  status,
  onStatusChange,
  onContinue,
}: CurrentSituationScreenProps) {
  return (
    <main>
      <h1>Your current situation</h1>

      <p>What is your current work situation?</p>

      <div>
        <label>
          <input
            type="radio"
            name="currentStatus"
            value="employed"
            checked={status === 'employed'}
            onChange={() => onStatusChange('employed')}
          />
          Employed
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            name="currentStatus"
            value="self_employed"
            checked={status === 'self_employed'}
            onChange={() => onStatusChange('self_employed')}
          />
          Self-employed
        </label>
      </div>

      <div>
        <label>
          <input
            type="radio"
            name="currentStatus"
            value="not_working"
            checked={status === 'not_working'}
            onChange={() => onStatusChange('not_working')}
          />
          Not working
        </label>
      </div>

      <button
        type="button"
        disabled={!status}
        onClick={onContinue}
      >
        Continue
      </button>
    </main>
  )
}

export default CurrentSituationScreen
