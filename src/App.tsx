import { useState } from 'react'
import CurrentSituationScreen from './CurrentSituationScreen'
import CurrentJobScreen from './CurrentJobScreen'
import CurrentPayScheduleScreen from './CurrentPayScheduleScreen'
import HomeTravelScreen from './HomeTravelScreen'
import CurrentCommuteCostsScreen from './CurrentCommuteCostsScreen'
import ComparisonScreen from './ComparisonScreen'
import AddJobScreen from './AddJobScreen'
import PayScheduleScreen from './PayScheduleScreen'
import CommuteCostsScreen from './CommuteCostsScreen'
import { formToJob } from './adapters/formToJob_v3'
import { calculateJob } from './calculations/calculateJob_v3'
import { defaultRules } from './rules/defaultRules_v3'
import type { JobDraft, CurrentJobDraft } from './types/formDraft_v3'
import type { Job } from './types/job_v3'
import {
  demoCurrentStatus,
  demoCurrentJobDraft,
  demoHomeTravelDraft,
  demoJobs,
} from './testData/demoData_v3'

type Screen =
  | 'current-situation'
  | 'current-job'
  | 'current-pay-schedule'
  | 'home-travel'
  | 'current-commute-costs'
  | 'comparison'
  | 'add-job'
  | 'pay-schedule'
  | 'commute-costs'

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

  const [jobDraft, setJobDraft] = useState<JobDraft>({
    scheduleInputMode: 'hours',
    position: '',
    company: '',
    location: '',
    employmentType: 'employed',
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

  const [userJobs, setUserJobs] = useState<Job[]>([])
  const [demoMode, setDemoMode] = useState(false)

  const leaveDemoMode = () => {
    if (!demoMode) return

    setCurrentStatus('')
    setCurrentJobDraft({
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
    setHomeTravelDraft({
      homePostcode: '',
      hasCar: false,
      fuelType: 'diesel',
      fuelConsumptionLitresPer100Km: '',
    })
    setUserJobs([])
    setDemoMode(false)
  }

  const currentJob =
    currentStatus === 'employed' || currentStatus === 'self_employed'
      ? formToJob(
          'current',
          currentJobDraft,
          homeTravelDraft,
          currentStatus,
          defaultRules,
        )
      : null

  const currentResult =
    currentJob === null
      ? null
      : calculateJob(currentJob, defaultRules)

  const loadDemoData = () => {
    setCurrentStatus(demoCurrentStatus)
    setCurrentJobDraft(structuredClone(demoCurrentJobDraft))
    setHomeTravelDraft(structuredClone(demoHomeTravelDraft))
    setUserJobs(structuredClone(demoJobs))
    setDemoMode(true)
    setScreen('comparison')
  }

  if (screen === 'current-situation') {
    return (
      <CurrentSituationScreen
        status={currentStatus}
        onStatusChange={setCurrentStatus}
        onLoadDemoData={loadDemoData}
        onContinue={() => {
          if (demoMode) {
            leaveDemoMode()
            return
          }

          setScreen(
            currentStatus === 'not_working'
              ? 'home-travel'
              : 'current-job',
          )
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
        currentStatus={currentStatus}
        homeTravelDraft={homeTravelDraft}
        setHomeTravelDraft={setHomeTravelDraft}
        onBack={() =>
          setScreen(
            currentStatus === 'not_working'
              ? 'current-situation'
              : 'current-pay-schedule',
          )
        }
        onContinue={() => {
          setScreen(
            currentStatus === 'not_working'
              ? 'comparison'
              : 'current-commute-costs',
          )
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
        onContinue={() => setScreen('comparison')}
      />
    )
  }

  if (screen === 'add-job') {
    return (
      <AddJobScreen
        jobDraft={jobDraft}
        setJobDraft={setJobDraft}
        onBack={() => setScreen('comparison')}
        onContinue={() => setScreen('pay-schedule')}
      />
    )
  }

  if (screen === 'pay-schedule') {
    return (
      <PayScheduleScreen
        jobDraft={jobDraft}
        setJobDraft={setJobDraft}
        onBack={() => setScreen('add-job')}
        onContinue={() => setScreen('commute-costs')}
      />
    )
  }

  if (screen === 'commute-costs') {
    return (
      <CommuteCostsScreen
        jobDraft={jobDraft}
        setJobDraft={setJobDraft}
        onBack={() => setScreen('pay-schedule')}
        onCompare={() => {
          const newJob = formToJob(
            `job-${userJobs.length + 1}`,
            jobDraft,
            homeTravelDraft,
            jobDraft.employmentType === 'self_employed'
              ? 'self_employed'
              : 'employed',
            defaultRules,
          )

          setUserJobs([...userJobs, newJob])
          setScreen('comparison')
        }}
      />
    )
  }

  if (screen === 'comparison') {
    return (
      <ComparisonScreen
        currentJob={currentJob}
        currentResult={currentResult}
        currentStatus={currentStatus}
        userJobs={userJobs}
        onAddJob={() => setScreen('add-job')}
        onRemoveJob={(jobId) =>
          setUserJobs(userJobs.filter((job) => job.id !== jobId))
        }
        onUpdateJob={(updatedJob) =>
          setUserJobs(
            userJobs.map((job) =>
              job.id === updatedJob.id ? updatedJob : job,
            ),
          )
        }
        onEditCurrent={() => setScreen('current-situation')}
      />
    )
  }

  return null
}

export default App
