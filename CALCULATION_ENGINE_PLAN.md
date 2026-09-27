# JobCompare --- Calculation Engine Plan

**Stage:** 05 --- Calculation Engine & TypeScript Foundation\
**Status:** Ready to implement\
**Inputs:** Google Sheet reference model + `DATA_MODEL_v1.1.md`

## Objective

Turn the validated spreadsheet logic and Data Model into a small,
testable TypeScript calculation engine before building the React
interface.

The calculation engine must be independent from the UI. React will
collect inputs and display outputs; it must not contain business
formulas.

## Source of truth

During this stage:

-   **Google Sheet** = reference for business logic and expected
    numerical results.
-   **DATA_MODEL_v1.1.md** = reference for data ownership and entity
    boundaries.
-   **TypeScript calculation engine** = implementation of that logic.
-   **Automated tests** = proof that the implementation reproduces the
    reference scenarios.

If a TypeScript result differs from the spreadsheet, investigate the
cause before changing either source.

## Implementation sequence

### 1. Create TypeScript domain types

Translate the Data Model into real TypeScript types/interfaces.

Initial files:

``` text
src/
└── types/
    ├── job.ts
    ├── rules.ts
    ├── results.ts
    └── personalisation.ts
```

The types should cover:

``` text
UserSituation
Job
Contract
Pay
  ├── EmployedPay
  └── SelfEmployedPay
Schedule
Workplace
Commute
Vehicle
WorkCost

OfficialRules
SystemRules
ProductRules
Assumptions

CalculationResult
ComparisonResult
DecisionSummary

Personalisation
PersonalisedResult
ProsConsItem
```

Important: do not duplicate fields just because the spreadsheet displays
them in several sections.

### 2. Create rules/configuration

Create:

``` text
src/rules/defaultRules.ts
```

This file will contain the actual configuration values used by the MVP,
organised under the same four groups as the spreadsheet:

``` text
official
system
product
assumptions
```

Examples:

``` text
Official Rules
→ tax thresholds
→ tax rates
→ employee NI thresholds/rates
→ self-employed NI thresholds/rates

System Rules
→ weeks per year
→ months per year
→ average weeks per month
→ miles-to-km conversion

Product Rules
→ shift boundaries
→ weekday/weekend definitions
→ allowed cost frequencies
→ contract/product definitions

Assumptions
→ petrol price
→ diesel price
→ scenario defaults where required
```

Calculation functions must read values from `rules`; tax thresholds,
rates and other configurable constants must not be buried inside
calculation formulas.

### 3. Build small calculation modules

Create:

``` text
src/
└── calculations/
    ├── pay.ts
    ├── tax.ts
    ├── nationalInsurance.ts
    ├── commute.ts
    ├── costs.ts
    ├── time.ts
    ├── calculateJob.ts
    └── compareJobs.ts
```

Responsibilities:

``` text
pay.ts
→ normalise Hour / Day / Week / Month / Year
→ normalise self-employed revenue and expenses
→ produce annual/monthly income bases

tax.ts
→ calculate estimated Income Tax from taxable income and Official Rules

nationalInsurance.ts
→ employee NI
→ self-employed NI

commute.ts
→ round-trip distance
→ monthly commute distance
→ monthly commute time
→ commute fuel
→ parking

costs.ts
→ normalise additional work costs to monthly
→ prevent calculation logic from mixing commute costs and generic work costs

time.ts
→ actual work hours
→ monthly work time
→ total committed time
→ effective net/hour inputs

calculateJob.ts
→ orchestrate all calculations for one Job
→ return CalculationResult

compareJobs.ts
→ compare candidate CalculationResult with baseline
→ return ComparisonResult
→ build the seven Decision Summary values
```

Pros & Cons should remain a separate module:

``` text
src/
└── personalisation/
    └── buildProsAndCons.ts
```

It is added after the core calculation engine is verified.

## Core calculation flow

``` text
Job + Rules
    ↓
normalise pay / revenue
    ↓
determine taxable income or taxable profit
    ↓
Income Tax
    ↓
National Insurance
    ↓
Net income
    ↓
Commute + parking + additional work costs
    ↓
Real Net
    ↓
Actual work time + commute time
    ↓
Total committed time
    ↓
Effective Net / Hour
    ↓
Comparison vs Current
    ↓
Decision Summary
```

## Key implementation rules

### Pay vs Schedule

`Pay` owns only the advertised monetary basis and amount.

``` text
pay.basis
pay.amount
```

`Schedule` owns working hours.

``` text
schedule.advertisedHoursPerWeek
schedule.expectedActualHoursPerWeek
```

For hourly employment:

``` text
annual gross =
hourly rate
× advertised hours/week
× weeks/year
```

Expected actual hours do not change advertised gross. They affect the
time-efficiency calculation.

### Self-employed

Do not treat revenue as taxable profit.

``` text
annual revenue
− deductible business expenses
= taxable profit
```

Tax and self-employed NI are calculated from the appropriate profit
basis.

A deductible business expense must not then be deducted a second time
after tax.

### Commute vs work travel

``` text
Home ↔ workplace
= Commute
```

For car travel, commute fuel is calculated from:

``` text
distance
× miles-to-km
× fuel consumption
× fuel price
```

Travel performed while doing the job is not commute.

Example:

``` text
Home → Amazon depot → Home
= commute

Amazon delivery route
= work/business travel
```

### Work costs

Monthly work costs must be composed explicitly:

``` text
totalWorkCostsMonthly =
commuteFuelCostMonthly
+ parkingCostMonthly
+ additionalWorkCostsMonthly
```

Then:

``` text
realNetMonthly =
netMonthly
− totalWorkCostsMonthly
```

### Time

``` text
actualWorkHoursPerWeek =
expectedActualHoursPerWeek
if supplied,
otherwise advertisedHoursPerWeek
```

Then:

``` text
actualWorkHoursMonthly =
actualWorkHoursPerWeek
× averageWeeksPerMonth

totalTimeMonthly =
actualWorkHoursMonthly
+ travelHoursMonthly

effectiveNetPerHour =
realNetMonthly / totalTimeMonthly
```

For a zero-work baseline, effective net/hour is `null`.

## Reference fixtures

Before building the UI, create test fixtures based on the existing
spreadsheet scenarios.

Suggested location:

``` text
src/
└── testData/
    └── referenceJobs.ts
```

The fixtures should cover the different calculation paths already
represented by the spreadsheet, including:

``` text
Current baseline / Council Clerk
Love Rokz
Amazon Delivery
PKL
Teacher
XYZ Ltd / Project Manager
Tesco
One Stop
```

Do not use these names as application architecture. They are reference
test data only.

## Automated tests

Suggested structure:

``` text
src/
└── calculations/
    └── __tests__/
        ├── pay.test.ts
        ├── tax.test.ts
        ├── commute.test.ts
        ├── calculateJob.test.ts
        └── compareJobs.test.ts
```

Test both individual functions and complete scenarios.

The most important tests are end-to-end calculation fixtures:

``` text
reference Job input
        ↓
calculateJob()
        ↓
actual result
        ↓
compare with expected Google Sheet result
```

## Reference outputs to verify

Use the live Google Sheet values at the moment test fixtures are
created. Do not rely on old screenshots or copied values if the
spreadsheet has since been intentionally changed.

For every reference job, verify at least:

``` text
Gross / year
Gross / month
Tax + NI
Net / month
Commute/work costs
Real net / month
Actual work hours / month
Travel hours / month
Total time / month
Effective net / hour
Income difference vs current
Time difference vs current
Effective rate difference
```

Also verify the final seven Decision Summary fields.

## Rounding policy

Do not hide rounding decisions inside UI formatting.

During implementation, explicitly define:

-   internal monetary precision;
-   when rounding occurs;
-   display rounding to pennies;
-   time precision;
-   tolerance used by automated tests.

Prefer calculations at full available precision and formatting/rounding
at clearly defined boundaries unless the spreadsheet reference logic
requires intermediate rounding.

## Validation

Before calculations run, reject or flag impossible inputs such as:

``` text
negative pay
negative hours
negative distance
negative travel time
zero/negative fuel consumption
missing hours for hourly pay
missing working days for daily pay
car commute without required vehicle data
on-site work without required commute data
```

Exact validation limits can be finalised during implementation.

## Definition of Done

This stage is complete when:

1.  TypeScript types represent the agreed Data Model.
2.  Rules/configuration are separated from formulas.
3.  Pay normalisation works for Hour / Day / Week / Month / Year.
4.  Employed Income Tax and NI calculations work.
5.  Self-employed revenue, expenses, taxable profit, Tax and NI are
    correctly separated.
6.  Commute fuel, parking and additional work costs are correctly
    separated.
7.  Work time and commute time produce total committed time.
8.  `calculateJob()` produces a complete `CalculationResult`.
9.  `compareJobs()` produces comparison values against the baseline.
10. The seven-field `DecisionSummary` can be generated.
11. Reference fixtures reproduce the agreed Google Sheet results within
    the defined tolerance.
12. No React component contains calculation formulas.

## What comes after this stage

Only after the calculation engine passes the reference tests:

``` text
Calculation Engine verified
        ↓
React UI implementation
        ↓
connect forms to Job/UserSituation
        ↓
connect results to Decision Summary
        ↓
Detailed Comparison
        ↓
Personalised Pros & Cons
        ↓
responsive polish
        ↓
README / RESEARCH / AI documentation
```

This keeps the product logic testable before visual implementation
begins.

## Editable Jobs and Recalculation Flow

The calculation engine must support recalculation after users edit previously entered job data. Editing does not modify calculated outputs directly; it updates the source `Job` or current-situation input and then runs the same calculation functions again.

Candidate-job flow:

```text
Edit Job
  -> update Job input by stable job ID
  -> calculateJob()
  -> CalculationResult
  -> compare with current baseline
  -> Decision Summary
  -> Pros & Cons (when enabled)
```

Current-situation flow:

```text
Edit Current Situation / Current Job
  -> recalculate baseline
  -> recalculate comparisons for ALL candidate jobs
  -> refresh Decision Summaries
  -> refresh Pros & Cons (when enabled)
```

Application state should provide the conceptual operations `addJob`, `updateJob`, and `deleteJob`. The calculation modules remain pure: they receive the latest inputs and rules and return newly derived results.

Editable inputs include company/position, pay, hours, days, shift times, contract details, workplace/remote status, commute distance and time, vehicle/fuel inputs, parking, and additional work costs. Derived values such as gross/month, tax, NI, net/month, real net, effective net/hour, income difference, and time difference are not directly editable.

### Implementation acceptance criteria

- A candidate job can be edited using its stable ID without changing its identity/order in the comparison.
- Saving an edit produces a fresh `CalculationResult` and `ComparisonResult`.
- Editing the baseline recalculates every candidate comparison.
- No UI component manually patches derived financial or time metrics.
- The same calculation functions are used for initial creation and subsequent edits.
