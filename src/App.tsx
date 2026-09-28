import { useState } from 'react'
import CurrentSituationScreen from './CurrentSituationScreen'
import CurrentJobScreen from './CurrentJobScreen'
import CurrentPayScheduleScreen from './CurrentPayScheduleScreen'
import HomeTravelScreen from './HomeTravelScreen'
import CurrentCommuteCostsScreen from './CurrentCommuteCostsScreen'
import type { CurrentJobDraft } from './types/formDraft_v3'

type Screen = 'current-situation' | 'current-job' | 'current-pay-schedule' | 'home-travel' | 'current-commute-costs'

type CurrentStatus =
  | 'employed'
  | 'self_employed'
  | 'not_working'

function App() {
  const [screen, setScreen] = useState<Screen>('current-situation')

  const [currentStatus, setCurrentStatus] = useState<
    CurrentStatus | ''
  >('')

  const [currentJobDraft, setCurrentJobDraft] = useState<CurrentJobDraft>({
    scheduleInputMode: 'hours',
    position: '',
    company: '',
    location: '',
    contractType: '',
    payBasis: 'hour',
    payAmount: '',
    advertisedHoursPerWeek: '',
    actualHoursPerWeek: '',
    shiftsPerWeek: '',
    workingDays: [],
    startTime: '',
    endTime: '',
    shift: '',
    commuteMethod: 'car',
    commuteDistanceMiles: '',
    commuteTimeMinutes: '',
    parkingPerWorkday: '',
    additionalWorkCosts: [],
    routeFuelEnabled: false,
    routeDistanceMilesPerWorkday: '',
    routeFuelType: 'diesel',
    routeFuelConsumptionLitresPer100Km: '',
  })

  const [homeTravelDraft, setHomeTravelDraft] = useState({
    homePostcode: '',
    hasCar: false,
    fuelType: 'diesel',
    fuelConsumptionLitresPer100Km: '',
  })

  if (screen === 'current-situation') {
    return (
      <CurrentSituationScreen
        status={currentStatus}
        onStatusChange={setCurrentStatus}
        onContinue={() => {
          setScreen(currentStatus === 'not_working' ? 'home-travel' : 'current-job')
        }}
      />
    )
  }

  if (screen === 'current-job') {
    return (
      <CurrentJobScreen
        currentJobDraft={currentJobDraft}
        setCurrentJobDraft={setCurrentJobDraft}
        onBack={() => setScreen('current-situation')}
        onContinue={() => setScreen('current-pay-schedule')}
      />
    )
  }

  if (screen === 'current-pay-schedule') {
    return (
      <CurrentPayScheduleScreen
        currentJobDraft={currentJobDraft}
        setCurrentJobDraft={setCurrentJobDraft}
        onBack={() => setScreen('current-job')}
        onContinue={() => setScreen('home-travel')}
      />
    )
  }

  if (screen === 'home-travel') {
    return (
      <HomeTravelScreen
        homeTravelDraft={homeTravelDraft}
        setHomeTravelDraft={setHomeTravelDraft}
        onBack={() =>
          setScreen(
            currentStatus === 'not_working'
              ? 'current-situation'
              : 'current-pay-schedule'
          )
        }
        onContinue={() => {
          if (currentStatus !== 'not_working') {
            setScreen('current-commute-costs')
          }
        }}
      />
    )
  }

  if (screen === 'current-commute-costs') {
    return (
      <CurrentCommuteCostsScreen
        currentJobDraft={currentJobDraft}
        setCurrentJobDraft={setCurrentJobDraft}
        onBack={() => setScreen('home-travel')}
        onContinue={() => {}}
      />
    )
  }

  return null
}

export default App
