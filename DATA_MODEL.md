# JobCompare --- Data Model

**Version:** 1.1\
**Status:** Ready for MVP implementation\
**Reference model:** Google Sheet `GitHub_test`\
**Modelling principle:** the spreadsheet is the source of truth for
business logic; this document separates that proven logic into software
entities without reproducing spreadsheet rows or cell references.

## 1. Purpose

This document defines the domain/data model for the JobCompare MVP.

The Google Sheet was created first to validate: - what the user
enters; - what the system calculates; - which values depend on which
inputs; - which rules and assumptions drive calculations; - which
results are shown in the comparison UI.

The web application must preserve those relationships while giving every
input and calculated value one clear owner.

Core principles: - Current situation is the comparison baseline. -
Current and candidate work use the same calculation concepts. -
Candidate jobs are stored as `jobs[]`, never as hard-coded Job1 / Job2
fields. - `Not working` is a valid zero-work baseline. - User input,
calculated values, rules and assumptions remain separate. - A value is
stored once; derived values are calculated rather than duplicated. - The
calculation engine is independent from React/UI components. -
`DecisionSummary` is the stable contract between calculations and the
primary comparison UI. - Personalised Pros & Cons are optional, factual
and do not create an overall score or automatic "best job" verdict.

------------------------------------------------------------------------

## 2. High-level model

``` text
AppState
├── userSituation
│   ├── homePostcode
│   ├── workStatus
│   ├── currentJob?
│   ├── currentVehicle?
│   └── personalisation?
│
├── jobs[]
│
├── rules
│   ├── official
│   ├── system
│   ├── product
│   └── assumptions
│
└── results
    ├── baselineResult
    └── jobResults[]
        ├── calculationResult
        ├── comparisonResult
        ├── decisionSummary
        └── personalisedResult?
```

The UI may offer actions such as **Use my current vehicle**, but those
actions copy/reuse data; they are not properties of the vehicle itself.

------------------------------------------------------------------------

## 3. Controlled types

``` text
WorkStatus = employed | self_employed | not_working

EmploymentType = employed | self_employed

ContractType = permanent | fixed_term | temporary

PayBasis = hour | day | week | month | year

IncomeFrequency = week | month | year

DayOfWeek = mon | tue | wed | thu | fri | sat | sun

ShiftCategory =
  day | evening | night | early_morning | variable

WorkMode = onsite | remote

CommuteMethod = car | walking | public_transport

FuelType = petrol | diesel

WorkCostType =
  work_fuel | vehicle_rental | insurance | other

CostFrequency = workday | week | month | year

MainPriority =
  more_income |
  more_free_time |
  free_weekends |
  preferred_shift |
  short_commute |
  career_development

ExperienceBand =
  no_experience |
  under_1_year |
  1_2_years |
  3_5_years |
  6_10_years |
  10_plus_years
```

`public_transport` is reserved for future use and is not active in the
MVP.

Parking is modelled under `Commute`, because the current UX captures it
together with travel. It is therefore not duplicated as a generic
`WorkCost`.

`work_fuel` means fuel used while doing the job, for example a delivery
route. Fuel used to travel from home to work and back is calculated
separately as commute fuel.

------------------------------------------------------------------------

## 4. UserSituation

``` text
UserSituation
├── homePostcode
├── workStatus
├── currentJob?
├── currentVehicle?
└── personalisation?
```

  -----------------------------------------------------------------------------------------
  Field               Type                       Required Source        Notes
  ------------------- ----------------- ----------------- ------------- -------------------
  `homePostcode`      string                          Yes USER INPUT    Entered once and
                                                                        reused for
                                                                        current/candidate
                                                                        commute

  `workStatus`        WorkStatus                      Yes USER INPUT    Employed /
                                                                        Self-employed / Not
                                                                        working

  `currentJob`        Job or null             Conditional USER INPUT    Null when not
                                                                        working

  `currentVehicle`    Vehicle or null                  No USER INPUT    Reusable for
                                                                        candidate jobs

  `personalisation`   Personalisation                  No USER INPUT    Optional Pros &
                      or null                                           Cons
  -----------------------------------------------------------------------------------------

### Not-working baseline

If `workStatus = not_working`:

``` text
gross = 0
tax = 0
NI = 0
net = 0
work costs = 0
work hours = 0
commute = 0
real net = 0
effective net/hour = null
```

This gives candidate jobs a valid £0 / 0-hours work baseline without
inventing a fake current job.

------------------------------------------------------------------------

## 5. Job

`Job` represents either the user's current work or a candidate vacancy.

``` text
Job
├── id
├── companyName?
├── position
├── employmentType
├── contract?
├── pay
├── schedule
├── workplace
├── commute?
├── vehicle?
├── workCosts[]
└── careerAreas[]
```

  -------------------------------------------------------------------------------------------
  Field              Type                      Required Source        Notes
  ------------------ ---------------- ----------------- ------------- -----------------------
  `id`               string                         Yes SYSTEM        Stable unique ID

  `companyName`      string or null         Conditional USER INPUT    Company/organisation;
                                                                      may be absent for
                                                                      self-employed current
                                                                      work

  `position`         string                         Yes USER INPUT    Job title or
                                                                      description of
                                                                      self-employed work

  `employmentType`   EmploymentType                 Yes USER INPUT    Determines pay/tax path

  `contract`         Contract or null       Conditional USER INPUT    Primarily employed
                                                                      vacancies; not forced
                                                                      for self-employed work

  `pay`              Pay                            Yes USER INPUT    Employed pay or
                                                                      self-employed
                                                                      revenue/expenses

  `schedule`         Schedule                       Yes USER INPUT    Hours, days and timing

  `workplace`        Workplace                      Yes USER INPUT    On-site / Remote

  `commute`          Commute or null        Conditional USER INPUT    Null for remote

  `vehicle`          Vehicle or null        Conditional USER INPUT /  Required only when
                                                        REUSED        commute calculation
                                                                      needs a car

  `workCosts`        WorkCost\[\]                    No USER INPUT /  Costs not already
                                                        DEFAULT       included elsewhere

  `careerAreas`      string\[\]                      No USER INPUT    Used for
                                                                      experience/career
                                                                      matching
  -------------------------------------------------------------------------------------------

Candidate vacancies are:

``` text
jobs: Job[]
```

There are no domain fields named `Job1`, `Job2`, etc.

------------------------------------------------------------------------

## 6. Contract

``` text
Contract
├── type
├── durationMonths?
└── note?
```

  ----------------------------------------------------------------------------------
  Field              Type                    Required Source        Notes
  ------------------ -------------- ----------------- ------------- ----------------
  `type`             ContractType                 Yes USER INPUT    Permanent /
                                                                    Fixed-term /
                                                                    Temporary

  `durationMonths`   number or null       Conditional USER INPUT    Used for
                                                                    time-limited
                                                                    contracts when
                                                                    known

  `note`             string or null                No USER INPUT    e.g. Maternity
                                                                    cover
  ----------------------------------------------------------------------------------

Contract describes the engagement. It does not affect current financial
calculations unless a future product rule explicitly uses it.

------------------------------------------------------------------------

## 7. Pay

Pay answers one question: **how is the money in the job advertised /
earned?**

Working hours do not live inside `Pay`; they belong to `Schedule`.

`Pay` is a discriminated structure:

``` text
Pay = EmployedPay | SelfEmployedPay
```

### 7.1 EmployedPay

``` text
EmployedPay
├── kind = employed
├── basis
└── amount
```

  Field      Type           Required Source
  ---------- ------------ ---------- --------------------------
  `kind`     `employed`          Yes SYSTEM / employment type
  `basis`    PayBasis            Yes USER INPUT
  `amount`   number              Yes USER INPUT

Examples:

``` text
£15 / hour
£180 / day
£600 / week
£2,500 / month
£36,000 / year
```

Gross normalisation follows the reference spreadsheet:

``` text
Year  → amount
Month → amount × monthsPerYear
Week  → amount × weeksPerYear
Day   → amount × workingDaysPerWeek × weeksPerYear
Hour  → amount × advertisedHoursPerWeek × weeksPerYear
```

For hourly pay, `advertisedHoursPerWeek` comes from `Schedule`.

For daily pay, the MVP uses the selected working days as paid workdays:

``` text
workingDaysPerWeek = schedule.workingDays.length
```

If a future use case requires multiple paid shifts on the same day, a
separate shift-count input can be introduced then.

### 7.2 SelfEmployedPay

``` text
SelfEmployedPay
├── kind = self_employed
├── revenueAmount
├── revenueFrequency
├── businessExpensesAmount
└── businessExpensesFrequency
```

  Field                         Type                Required Source
  ----------------------------- ----------------- ---------- --------------------------
  `kind`                        `self_employed`          Yes SYSTEM / employment type
  `revenueAmount`               number                   Yes USER INPUT
  `revenueFrequency`            IncomeFrequency          Yes USER INPUT
  `businessExpensesAmount`      number                   Yes USER INPUT
  `businessExpensesFrequency`   IncomeFrequency          Yes USER INPUT

The calculation engine normalises revenue and business expenses to
annual values:

``` text
annualRevenue
− annualDeductibleBusinessExpenses
= taxableProfitAnnual
```

Income Tax and self-employed NI use `taxableProfitAnnual`, not revenue.

A business expense used to calculate taxable profit must not then be
deducted a second time from post-tax income.

------------------------------------------------------------------------

## 8. Schedule

Schedule owns all information about **how much and when the person
works**.

``` text
Schedule
├── advertisedHoursPerWeek
├── expectedActualHoursPerWeek?
├── workingDays[]
├── typicalStartTime?
├── typicalEndTime?
└── hoursVary
```

  ------------------------------------------------------------------------------------------------
  Field                          Type                     Required Source        Notes
  ------------------------------ --------------- ----------------- ------------- -----------------
  `advertisedHoursPerWeek`       number                        Yes USER INPUT    Hours stated in
                                                                                 the
                                                                                 vacancy/current
                                                                                 employment terms

  `expectedActualHoursPerWeek`   number or null                 No USER INPUT    Realistic
                                                                                 estimate if
                                                                                 actual time
                                                                                 differs

  `workingDays`                  DayOfWeek\[\]                 Yes USER INPUT    Mon--Sun
                                                                                 selections

  `typicalStartTime`             HH:mm or null         Conditional USER INPUT    Not required when
                                                                                 hours vary

  `typicalEndTime`               HH:mm or null         Conditional USER INPUT    Not required when
                                                                                 hours vary

  `hoursVary`                    boolean                       Yes USER INPUT    Variable working
                                                                                 pattern
  ------------------------------------------------------------------------------------------------

Derived values:

``` text
workingDaysPerWeek = workingDays.length

weekendDaysWorkedPerWeek =
count(Sat, Sun in workingDays)

actualWorkHoursPerWeek =
expectedActualHoursPerWeek
if supplied,
otherwise advertisedHoursPerWeek
```

`advertisedHoursPerWeek` and `expectedActualHoursPerWeek` deliberately
have different purposes.

Example:

``` text
Pay: £15/hour
Advertised hours: 24/week
Expected actual hours: 30/week
```

Gross pay:

``` text
£15 × 24 × 52
```

Time-efficiency calculation:

``` text
30 actual work hours/week + commute time
```

This preserves the difference between what the vacancy states and what
the user realistically expects to spend.

### Shift category

Shift category is calculated rather than manually selected for the job.

It uses `ProductRules` boundaries and the start/end time. If
`hoursVary = true`, the result is `variable`.

------------------------------------------------------------------------

## 9. Workplace

``` text
Workplace
├── mode
├── postcodeOrAddress?
└── displayLocation?
```

  ------------------------------------------------------------------------------------
  Field                 Type                   Required Source        Notes
  --------------------- ------------- ----------------- ------------- ----------------
  `mode`                WorkMode                    Yes USER INPUT    On-site / Remote

  `postcodeOrAddress`   string or           Conditional USER INPUT    Required for
                        null                                          on-site work

  `displayLocation`     string or                    No CALCULATED /  Human-readable
                        null                            FUTURE        location
  ------------------------------------------------------------------------------------

Automatic postcode/address lookup is outside MVP scope.

For `remote`, commute time, distance, commute fuel and parking are zero.

------------------------------------------------------------------------

## 10. Commute

Commute represents **home ↔ workplace travel**, not travel performed as
part of the job.

``` text
Commute
├── method
├── oneWayDistanceMiles
├── oneWayTravelMinutes
└── parkingCostPerWorkday
```

  ---------------------------------------------------------------------------------------
  Field                     Type                     Required Source        Notes
  ------------------------- --------------- ----------------- ------------- -------------
  `method`                  CommuteMethod                 Yes USER INPUT    Car / Walking
                                                                            / future
                                                                            public
                                                                            transport

  `oneWayDistanceMiles`     number                Conditional USER INPUT    Needed where
                                                                            distance
                                                                            affects cost

  `oneWayTravelMinutes`     number                        Yes USER INPUT    Manual MVP
                                                                            input

  `parkingCostPerWorkday`   number                         No USER INPUT    £ per workday
  ---------------------------------------------------------------------------------------

Derived commute values belong to `CalculationResult`, not to the stored
`Commute` input object:

``` text
roundTripDistanceMiles
monthlyCommuteDistanceMiles
monthlyTravelHours
commuteFuelCostMonthly
parkingCostMonthly
```

For car commute:

``` text
roundTripDistanceMiles =
oneWayDistanceMiles × 2

monthlyCommuteDistanceMiles =
roundTripDistanceMiles
× workingDaysPerWeek
× averageWeeksPerMonth

kilometres =
monthlyCommuteDistanceMiles × milesToKm

litres =
kilometres × fuelConsumptionLPer100Km / 100

commuteFuelCostMonthly =
litres × fuelPrice
```

Travel time:

``` text
monthlyTravelHours =
(oneWayTravelMinutes × 2 / 60)
× workingDaysPerWeek
× averageWeeksPerMonth
```

Distance and travel time are entered manually in the MVP. Maps/routing
is future scope.

------------------------------------------------------------------------

## 11. Vehicle

Vehicle contains only characteristics of the vehicle used for commute
calculations.

``` text
Vehicle
├── fuelType
└── fuelConsumptionLPer100Km
```

  Field                        Type         Required Source
  ---------------------------- ---------- ---------- ------------
  `fuelType`                   FuelType          Yes USER INPUT
  `fuelConsumptionLPer100Km`   number            Yes USER INPUT

Fuel price comes from `Assumptions`, not from `Vehicle`.

The UI action **Use my current vehicle** reuses/copies
`UserSituation.currentVehicle`; it is not stored as a `Vehicle`
property.

Vehicle wear/depreciation is outside MVP scope.

------------------------------------------------------------------------

## 12. WorkCost

`WorkCost` is for additional costs caused by the job that are not
already represented by commute/parking and are not already included in
self-employed deductible business expenses.

``` text
WorkCost
├── id
├── type
├── amount
├── frequency
└── description?
```

  -----------------------------------------------------------------------------
  Field           Type                     Required Source        Notes
  --------------- --------------- ----------------- ------------- -------------
  `id`            string                        Yes SYSTEM        Stable ID

  `type`          WorkCostType                  Yes USER INPUT    Work fuel /
                                                                  Vehicle
                                                                  rental /
                                                                  Insurance /
                                                                  Other

  `amount`        number                        Yes USER INPUT /  Cost amount
                                                    DEFAULT       

  `frequency`     CostFrequency                 Yes USER INPUT    Workday /
                                                                  Week / Month
                                                                  / Year

  `description`   string or null                 No USER INPUT    Used
                                                                  especially
                                                                  for Other
  -----------------------------------------------------------------------------

Monthly normalisation:

``` text
Workday → amount × workingDaysPerWeek × averageWeeksPerMonth
Week    → amount × averageWeeksPerMonth
Month   → amount
Year    → amount ÷ monthsPerYear
```

### Commute fuel vs work fuel

These are different:

``` text
Home → workplace → home
= commute fuel
= calculated from Commute + Vehicle

Travel while performing the job
= work fuel
= WorkCost
```

Example: for a delivery job, driving from home to the depot is commute;
fuel used on the delivery route is a work/business cost.

No cost should be entered in both places.

------------------------------------------------------------------------

## 13. Rules

``` text
Rules
├── OfficialRules
├── SystemRules
├── ProductRules
└── Assumptions
```

Rules are configuration. They are not duplicated inside job data or
calculation functions.

### 13.1 OfficialRules

Contains official tax/NI parameters used by the reference model:

``` text
taxYear
personalAllowance
personalAllowanceTaperStart
basicTaxBand
basicTaxRate
higherTaxRate
additionalRateThreshold
additionalTaxRate

employeeNIPrimaryThreshold
employeeNIUpperLimit
employeeNIMainRate
employeeNIUpperRate

selfEmployedNILowerProfits
selfEmployedNIUpperProfits
selfEmployedNIMainRate
selfEmployedNIUpperRate
```

Calculation functions read these values; thresholds/rates are not
hard-coded into the functions.

### 13.2 SystemRules

Reference model:

``` text
weeksPerYear = 52
monthsPerYear = 12
averageWeeksPerMonth = 52 / 12
milesToKm = 1.609344
```

Also owns generic cost-frequency conversion rules.

### 13.3 ProductRules

Contains product definitions rather than government rules:

``` text
shift boundaries
weekday/weekend definitions
allowed work-cost types
cost frequencies
contract types
contract duration unit
experience bands
main-priority options
Pros & Cons factors/behaviour
```

Main priority is one selected priority. It highlights the corresponding
Pros & Cons factor; it does not filter out other applicable factors.

### 13.4 Assumptions

Contains updateable external or working assumptions such as:

``` text
petrol price
diesel price
tax/payroll scope note
delivery scenario defaults
```

Scenario-specific defaults can prefill inputs but do not replace the
generic domain model.

------------------------------------------------------------------------

## 14. CalculationResult

Calculated values are kept separate from user-entered `Job` data.

``` text
CalculationResult
├── income
├── deductions
├── workCosts
├── time
└── workPattern
```

### Income and tax

  ----------------------------------------------------------------------------
  Field                        Type                    Meaning
  ---------------------------- ----------------------- -----------------------
  `grossAnnual`                number                  Normalised gross
                                                       salary/revenue display
                                                       value

  `grossMonthly`               number                  Normalised
                                                       gross/revenue ÷ 12

  `taxableIncomeAnnual`        number                  Salary taxable basis or
                                                       self-employed taxable
                                                       profit

  `incomeTaxAnnual`            number                  Estimated annual Income
                                                       Tax

  `incomeTaxMonthly`           number                  Annual Income Tax ÷ 12

  `nationalInsuranceAnnual`    number                  Estimated annual NI

  `nationalInsuranceMonthly`   number                  Annual NI ÷ 12

  `taxAndNIMonthly`            number                  Tax + NI monthly

  `netMonthly`                 number                  Income after estimated
                                                       Tax + NI
  ----------------------------------------------------------------------------

For employed work:

``` text
taxable basis derives from gross salary
```

For self-employed work:

``` text
annualRevenue
− annualDeductibleBusinessExpenses
= taxableProfitAnnual
```

and `taxableIncomeAnnual = taxableProfitAnnual`.

### Work costs

  ------------------------------------------------------------------------------
  Field                          Type                    Meaning
  ------------------------------ ----------------------- -----------------------
  `commuteFuelCostMonthly`       number                  Home↔work car fuel

  `parkingCostMonthly`           number                  Parking for workdays

  `additionalWorkCostsMonthly`   number                  Sum of normalised
                                                         WorkCost items

  `totalWorkCostsMonthly`        number                  All post-tax work costs

  `realNetMonthly`               number                  Net after work-related
                                                         costs
  ------------------------------------------------------------------------------

``` text
totalWorkCostsMonthly =
commuteFuelCostMonthly
+ parkingCostMonthly
+ additionalWorkCostsMonthly

realNetMonthly =
netMonthly
− totalWorkCostsMonthly
```

For walking/remote commute, commute fuel is zero.

For self-employed work, a deductible business expense already used to
derive taxable profit is not deducted again here.

### Time

  --------------------------------------------------------------------------
  Field                      Type                    Meaning
  -------------------------- ----------------------- -----------------------
  `actualWorkHoursWeekly`    number                  Expected actual hours,
                                                     otherwise advertised
                                                     hours

  `actualWorkHoursMonthly`   number                  Weekly actual hours ×
                                                     average weeks/month

  `travelHoursMonthly`       number                  Commute time

  `totalTimeMonthly`         number                  Work + commute

  `totalTimeWeekly`          number                  Monthly total converted
                                                     to weekly

  `effectiveNetPerHour`      number or null          Real net ÷ total
                                                     committed time
  --------------------------------------------------------------------------

``` text
actualWorkHoursWeekly =
expectedActualHoursPerWeek
if provided
else advertisedHoursPerWeek

actualWorkHoursMonthly =
actualWorkHoursWeekly × averageWeeksPerMonth

totalTimeMonthly =
actualWorkHoursMonthly + travelHoursMonthly

totalTimeWeekly =
totalTimeMonthly / averageWeeksPerMonth

effectiveNetPerHour =
realNetMonthly / totalTimeMonthly
```

If total committed work time is zero, `effectiveNetPerHour = null`.

### Work pattern

  Field                        Type
  ---------------------------- ---------------
  `workingDaysPerWeek`         number
  `weekendDaysWorkedPerWeek`   number
  `shiftCategory`              ShiftCategory

------------------------------------------------------------------------

## 15. ComparisonResult

Every candidate job is compared with the current baseline.

``` text
ComparisonResult
├── incomeDifferenceMonthly
├── timeDifferenceWeeklyHours
├── effectiveRateDifference
├── extraIncomePerExtraHour
├── weekendWorkIndicator
├── shiftTimingIndicator
└── additionalWorkCostsIndicator
```

  -----------------------------------------------------------------------
  Field                               Meaning
  ----------------------------------- -----------------------------------
  `incomeDifferenceMonthly`           candidate real net − baseline real
                                      net

  `timeDifferenceWeeklyHours`         candidate total time/week −
                                      baseline

  `effectiveRateDifference`           candidate effective net/hour −
                                      baseline

  `extraIncomePerExtraHour`           income difference divided by
                                      additional committed time where
                                      meaningful

  `weekendWorkIndicator`              Factual weekend-work label

  `shiftTimingIndicator`              Factual shift label

  `additionalWorkCostsIndicator`      Factual additional-cost label
  -----------------------------------------------------------------------

`extraIncomePerExtraHour` is only meaningful when the candidate requires
additional time. It should be `null` where the denominator does not
represent extra committed hours.

------------------------------------------------------------------------

## 16. DecisionSummary

`DecisionSummary` is the stable contract between the calculation engine
and the main comparison UI.

It contains exactly the seven agreed headline metrics:

``` text
DecisionSummary
├── grossMonthly
├── realNetMonthly
├── incomeDifferenceMonthly
├── totalTimeWeekly
├── timeDifferenceWeekly
├── effectiveNetPerHour
└── workPattern
```

1.  `grossMonthly` --- Estimated gross / month\
2.  `realNetMonthly` --- Real net / month\
3.  `incomeDifferenceMonthly` --- Income difference vs current\
4.  `totalTimeWeekly` --- Total time / week\
5.  `timeDifferenceWeekly` --- Time difference vs current\
6.  `effectiveNetPerHour` --- Effective net / hour\
7.  `workPattern` --- Shift + weekend status

Examples:

``` text
Day · No weekend work
Evening · 1 weekend day
Variable · 2 weekend days
```

The compact comparison UI must not invent a different summary metric
set.

------------------------------------------------------------------------

## 17. Personalisation

Personalisation is optional and does not affect the core financial
calculation.

``` text
Personalisation
├── mainPriority?
├── preferredShift?
├── experience[]
└── desiredCareerDirections[]
```

  Field                       Type                      Required
  --------------------------- ----------------------- ----------
  `mainPriority`              MainPriority or null            No
  `preferredShift`            ShiftCategory or null           No
  `experience`                ExperienceEntry\[\]             No
  `desiredCareerDirections`   string\[\]                      No

``` text
ExperienceEntry
├── area
└── band
```

``` text
area: string
band: ExperienceBand
```

------------------------------------------------------------------------

## 18. PersonalisedResult / Pros & Cons

``` text
PersonalisedResult
├── pros[]
└── cons[]
```

Each item:

``` text
ProsConsItem
├── factor
├── kind
├── label
├── value?
└── isMainPriority
```

Supported factors in the current model:

``` text
income
free_time
weekends
shift
commute
experience
career_direction
```

`contract` can be added later as a personalised factor if the product
collects a corresponding user preference.

Rules: - Generate all applicable Pros & Cons. - One factor per
item/row. - Neutral factors may be omitted. - Main priority highlights
the corresponding factor. - Main priority does not hide other applicable
factors. - No overall score. - No automatic "best job" verdict. - Pros &
Cons use calculated/input facts; they do not invent subjective
attributes not present in the model.

Examples of source relationships:

``` text
Income
← ComparisonResult.incomeDifferenceMonthly

Free time
← ComparisonResult.timeDifferenceWeeklyHours

Weekends
← CalculationResult.weekendDaysWorkedPerWeek

Shift
← CalculationResult.shiftCategory
  compared with Personalisation.preferredShift

Commute
← calculated commute compared with baseline

Experience
← Job.careerAreas compared with Personalisation.experience

Career direction
← Job.careerAreas compared with desiredCareerDirections
```

------------------------------------------------------------------------

## 19. Data ownership map

This is the key rule preventing duplication.

``` text
USER INPUT

UserSituation
→ home postcode
→ current status
→ personalisation

Pay
→ pay basis / pay amount
→ OR self-employed revenue / business expenses

Schedule
→ advertised hours
→ expected actual hours
→ working days
→ start / finish / variable hours

Contract
→ contract type / duration / note

Workplace
→ on-site / remote / workplace location

Commute
→ transport method
→ one-way distance
→ one-way time
→ parking

Vehicle
→ fuel type
→ fuel consumption

WorkCost
→ additional costs not represented elsewhere
```

``` text
RULES / ASSUMPTIONS

OfficialRules
→ Tax / NI

SystemRules
→ time and unit conversions

ProductRules
→ shift/weekend/product definitions

Assumptions
→ fuel prices and scenario defaults
```

``` text
CALCULATED

CalculationResult
→ gross
→ taxable income
→ tax
→ NI
→ net
→ commute cost
→ parking
→ additional costs
→ real net
→ work time
→ commute time
→ total time
→ effective net/hour
→ shift/weekend outputs

ComparisonResult
→ differences vs current

DecisionSummary
→ seven headline comparison values

PersonalisedResult
→ Pros & Cons
```

No calculated field should be separately editable by the user.

------------------------------------------------------------------------

## 20. Calculation dependency flow

``` text
                    ┌───────────────┐
                    │     Pay       │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │   Schedule    │
                    └───────┬───────┘
                            │
                      Gross / Revenue
                            │
                 ┌──────────▼──────────┐
                 │ Taxable income/profit│
                 └──────────┬──────────┘
                            │
                    Official Rules
                            │
                       Tax + NI
                            │
                            ▼
                           Net
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
       Commute           Parking        WorkCosts[]
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                    Total work costs
                            │
                            ▼
                         Real Net
                            │
                            ├──────────────┐
                            │              │
                         Schedule       Commute time
                            │              │
                            └──────┬───────┘
                                   ▼
                              Total Time
                                   │
                                   ▼
                         Effective Net / Hour
                                   │
                                   ▼
                         Comparison vs Current
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
             Decision Summary              Pros & Cons
```

------------------------------------------------------------------------

## 21. Application calculation flow

``` text
User input
    ↓
UserSituation + Job
    ↓
validate
    ↓
normalise pay / revenue / costs / time
    ↓
calculateJob(job, rules)
    ↓
CalculationResult
    ↓
compareWithBaseline(candidate, baseline)
    ↓
ComparisonResult
    ↓
buildDecisionSummary(...)
    ↓
DecisionSummary
    ↓
buildProsAndCons(..., personalisation) [optional]
    ↓
PersonalisedResult
    ↓
UI
```

The UI displays results; it does not contain business formulas.

------------------------------------------------------------------------

## 22. Proposed TypeScript structure

``` text
src/
├── types/
│   ├── job.ts
│   ├── rules.ts
│   ├── results.ts
│   └── personalisation.ts
│
├── rules/
│   └── defaultRules.ts
│
├── calculations/
│   ├── pay.ts
│   ├── tax.ts
│   ├── nationalInsurance.ts
│   ├── commute.ts
│   ├── costs.ts
│   ├── time.ts
│   ├── calculateJob.ts
│   └── compareJobs.ts
│
└── personalisation/
    └── buildProsAndCons.ts
```

This folder structure is an implementation proposal, not a business
rule.

------------------------------------------------------------------------

## 23. Reference-model tests

The Google Sheet supplies the reference scenarios for testing the
TypeScript engine.

Tests should cover at least:

-   annual salaried employee;
-   hourly employee;
-   daily-paid work;
-   self-employed revenue and business expenses;
-   significant additional work costs;
-   work fuel separate from commute fuel;
-   vehicle rental;
-   parking;
-   long commute;
-   part-time work;
-   walking/no-fuel commute;
-   remote work;
-   weekend work;
-   variable shift;
-   fixed-term/temporary contract;
-   candidate with higher real income than current;
-   candidate with lower income but lower time commitment;
-   zero-work baseline.

For each fixture, the code should reproduce the agreed spreadsheet
outputs within the agreed rounding tolerance.

The goal is to reproduce business logic, not spreadsheet cell structure.

------------------------------------------------------------------------

## 24. MVP boundaries

### Included

-   Current-situation baseline
-   Not-working baseline
-   Manual job input
-   Multiple candidate jobs
-   Employed and self-employed paths
-   Hour / Day / Week / Month / Year advertised pay
-   Advertised vs expected actual working hours
-   Working days and calculated shift
-   Contract type/duration
-   Manual commute distance/time
-   Car fuel calculation
-   Walking
-   Parking
-   Generic additional work costs
-   Estimated Income Tax + NI
-   Real Net
-   Total committed time
-   Effective net/hour
-   Comparison vs current
-   Seven-metric Decision Summary
-   Optional personalised Pros & Cons
-   Rules/configuration separated from calculations

### Later

-   Job-description text parsing
-   Vacancy URL parsing
-   Google Maps/routing
-   Public-transport routing
-   Automatic city/address lookup
-   Accounts/login
-   Backend/database/cloud sync
-   Full benefits/Universal Credit engine
-   Vehicle wear/depreciation
-   Automatic AI career classification
-   Production-grade payroll/accounting

------------------------------------------------------------------------

## 25. Implementation decisions fixed in v1.1

The following are no longer open questions:

1.  `Pay` does not store working hours.
2.  `Schedule` owns advertised and expected actual hours.
3.  Hourly gross uses advertised hours, not expected actual hours.
4.  Expected actual hours are used for time-efficiency calculations.
5.  Daily pay uses selected working days per week in the MVP.
6.  Employed and self-employed pay use separate data shapes.
7.  Self-employed tax uses taxable profit, not revenue.
8.  Business expenses used before tax are not deducted twice.
9.  Parking belongs to commute, not generic WorkCost.
10. Commute fuel and fuel used while performing the job are separate.
11. Vehicle stores vehicle characteristics only.
12. "Use my current vehicle" is UI behaviour, not vehicle data.
13. Calculated commute values live in CalculationResult rather than
    being duplicated in input objects.
14. DecisionSummary remains exactly seven headline metrics.
15. Main priority highlights Pros & Cons; it does not filter them or
    create a score.

Still to decide during implementation: - exact money/time rounding
policy; - pennies vs decimal representation internally; - validation
limits for hours, distance and fuel consumption; - exact overnight-shift
edge cases; - whether MVP persistence uses `localStorage`.

------------------------------------------------------------------------

## 26. Definition of Done --- Data Model v1.1

The model is ready for implementation when:

-   every MVP input shown in the agreed UX has one clear owner;
-   every spreadsheet calculation required by the MVP can be derived
    from those inputs plus rules;
-   the same value is not stored in multiple entities;
-   calculated values are separated from editable inputs;
-   current and candidate jobs can use the same calculation engine;
-   not-working baseline is supported;
-   employed and self-employed tax bases are distinguished;
-   commute costs cannot be accidentally duplicated as generic work
    costs;
-   multiple candidate jobs use `jobs[]`;
-   all seven Decision Summary metrics can be produced;
-   Pros & Cons can be produced from factual inputs/results without an
    overall score;
-   implementation has no dependency on spreadsheet column letters, row
    numbers or cell addresses;
-   spreadsheet scenarios can be converted into automated calculation
    fixtures.

At this point the Google Sheet remains the reference model for expected
business outcomes, while this document becomes the reference model for
software data ownership and entity boundaries.

## Editable Jobs and Recalculation

Jobs are editable domain entities. Each `Job` must have a stable `id` so that an existing candidate job can be updated without creating a new comparison item.

The user edits source/input data only, for example company name, position, pay, working hours, working days, shift times, contract details, workplace, commute distance/time, vehicle inputs, parking, and additional work costs. Derived calculation fields must never be directly editable.

Application-level job operations should support:

```ts
addJob(job: Job): void
updateJob(jobId: string, changes: Partial<Job>): void
deleteJob(jobId: string): void
```

After a candidate job is updated, the application must run the normal calculation pipeline again:

```text
update Job input
    -> calculateJob()
    -> CalculationResult
    -> compareJobs()
    -> DecisionSummary
    -> personalised Pros & Cons (when enabled)
```

Editing the current situation/current job changes the baseline. When the baseline changes, all candidate comparisons must be recalculated against the new baseline.

```text
update Current Situation / Current Job
    -> recalculate baseline
    -> recalculate comparison for every candidate job
    -> refresh Decision Summary and personalised results
```

This is a state-management concern rather than a separate calculation formula. `CalculationResult`, `ComparisonResult`, `DecisionSummary`, and personalised results are derived state and should be regenerated from the current source inputs rather than manually patched.

### UI implication

The comparison UI can expose `Edit` for the current situation and each candidate job. Editing should reopen the relevant form populated with the existing source values. Saving changes updates the entity and triggers recalculation. Candidate jobs can also support `Delete` and the comparison view can support `Add another job`.
