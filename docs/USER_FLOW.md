# JobCompare — User Flow

## Purpose

This document describes the intended end-to-end user flow for the JobCompare MVP.

The flow was implemented incrementally. Individual Git commits may therefore contain only part of the journey described here.

The user interface is intentionally separated from the calculation engine:

**User input → Form state → Job model → Calculation engine → Comparison**

The UI collects source information. Calculated outputs are produced by the calculation engine and are not entered or edited directly by the user.

---

## 1. Starting point — Current Situation

The application starts by asking:

**What is your current work situation?**

Options:

- Employed
- Self-employed
- Not working

A selection is required before the user can continue.

### Flow

If the user selects **Employed** or **Self-employed**:

**Current Situation → Current Job → Current Pay & Schedule → Home & Travel → Current Commute & Costs → Comparison**

If the user selects **Not working**:

**Current Situation → Home & Travel → Comparison**

A Not Working baseline does not require current-job, pay, schedule or commute inputs.

---

## 2. Current Job

For a working baseline, the next screen collects descriptive information about the current job.

Fields:

- Position
- Company
- Location
- Contract
  - Permanent
  - Temporary
  - Fixed-term

The employment type is inherited from the Current Situation selection rather than asked again.

These values provide context for the comparison. They do not contain calculated outputs.

---

## 3. Current Pay & Schedule

This screen collects the information needed to calculate current income, working time and work pattern.

### Pay

Fields:

- Pay basis
  - Per hour
  - Per day
  - Per week
  - Per month
  - Per year
- Pay amount
- Advertised hours per week
- Expected actual hours per week
- Shifts per week

Advertised hours and expected actual hours are deliberately separate.

Advertised hours are used where required by the pay calculation, particularly for hourly pay. Expected actual hours represent the realistic amount of working time and are used for time-based comparison.

Shifts per week are separate from working days because they also affect calculations such as daily pay, commuting frequency and workday-based costs.

### Working days

The user can select:

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

Working days describe the schedule and support work-pattern calculations.

### Schedule details

The user chooses between:

**I know the working hours**

Fields:

- Start time
- End time

or:

**I only know the shift**

Field:

- Shift
  - Early
  - Day
  - Evening
  - Night
  - Variable

This allows the application to work with either precise schedule information or a broader shift description.

---

## 4. Home & Travel

Home and vehicle information is collected separately because the same information can be reused when comparing several jobs.

Fields:

- Home postcode
- I use a car for commuting

If a car is selected:

- Fuel type
  - Petrol
  - Diesel
  - Electric
  - Other
- Fuel consumption in litres per 100 km

The current MVP does not automatically calculate routes from the postcode. Commute distance and time are entered manually later.

---

## 5. Current Commute & Costs

For a working baseline, the user describes the current commute.

### Commute method

Options:

- Car
- Walking
- Remote / work from home

If the job is not remote:

- One-way distance in miles
- One-way travel time in minutes

If Car is selected:

- Parking cost per workday

Remote work does not require commute distance or travel time.

### Additional work costs

The user can add multiple costs that are directly related to doing the job.

For each cost the user provides:

- Description
- Amount
- Frequency:
  - Per workday
  - Per week
  - Per month
  - Per year

Individual costs can also be removed.

### Route fuel

If the job involves additional driving during the workday, this is treated separately from the normal commute.

The user can enable route-fuel calculation and provide:

- Route distance per workday
- Fuel type
- Vehicle consumption in L/100 km

The fuel cost is calculated from the route distance, vehicle consumption and the fuel-price assumption.

This keeps travel from home to work separate from driving that is required while performing the job.

After this screen the current baseline can be calculated and the user proceeds to Comparison.

---

## 6. Comparison

The Comparison screen is the main output of the MVP.

It presents the current situation and candidate jobs side by side.

The comparison includes:

- Location
- Employment
- Contract
- Gross pay
- Real Net
- Change in money versus current
- Total Time
- Change in time versus current
- Effective Net per Hour
- Work Pattern

The current situation acts as the baseline.

If the user is Not Working, the baseline uses zero income and zero work-related time, while Effective Net per Hour is not applicable.

The comparison presents trade-offs rather than declaring one job to be the best option.

From this screen the user can:

- Add another job
- Edit a job
- Remove a candidate job
- Return to the current situation
- Open the personalisation interface

---

## 7. Add Candidate Job

Selecting **+ Add job** starts the candidate-job flow.

Fields:

- Position
- Company
- Location
- Employment
  - Employed
  - Self-employed
- Contract
  - Permanent
  - Temporary
  - Fixed-term

Unlike the current-job flow, employment type is selected here because each candidate job can have a different employment type.

### Flow

**Add Job → Pay & Schedule → Commute & Costs → Comparison**

---

## 8. Candidate Pay & Schedule

The candidate-job screen follows the same core schedule structure as the current-job flow.

Fields:

- Pay basis
  - Per hour
  - Per day
  - Per week
  - Per month
  - Per year
- Pay amount
- Advertised hours per week
- Expected actual hours per week
- Shifts per week
- Working days

Schedule details can again be entered as either:

- Start time and End time

or:

- Early
- Day
- Evening
- Night
- Variable

The same underlying Job model and calculation rules are used for current and candidate jobs.

---

## 9. Candidate Commute & Costs

The candidate commute screen collects commute information and job-specific costs.

### Commute

Options:

- Car
- Walking
- Remote / work from home

For non-remote work:

- One-way distance in miles
- One-way travel time in minutes

For car commuting:

- Parking cost per workday

The vehicle information previously entered under Home & Travel is reused for car commute calculations.

### Additional work costs

Candidate jobs can contain multiple work-related costs.

For each cost the user can enter:

- Description
- Amount
- Frequency
  - Per workday
  - Per week
  - Per month
  - Per year

Costs can be added and removed individually.

This supports jobs with different cost structures without hard-coding a fixed list of expenses.

---

## 10. Route Fuel

The candidate-job flow contains a separate route-fuel option for jobs that involve additional driving while working.

The user can select:

**This job involves additional driving during the workday**

If enabled, the user enters:

- Route distance per workday
- Fuel type
  - Diesel
  - Petrol
- Vehicle consumption in litres per 100 km

The fuel cost is calculated automatically using the central fuel-price assumption.

The calculated route fuel becomes an Additional Work Cost.

This keeps two different journeys separate:

- Home ↔ workplace/depot commute
- Driving performed as part of the job

Both affect Real Net, but they represent different costs.

---

## 11. Creating the Candidate Comparison

After the candidate Commute & Costs screen, the form data is converted into the canonical Job model.

The calculation engine then derives the financial and time results.

The new candidate is added to the Comparison screen alongside the current baseline and any previously entered candidate jobs.

The user can repeat the Add Job flow to compare multiple jobs.

---

## 12. Editing and Removing Jobs

Candidate jobs can be edited from the Comparison screen.

The edit interface works with source job data rather than calculated outputs.

Editable information includes:

- Position and company
- Location
- Employment type
- Contract
- Pay
- Schedule
- Working days
- Commute
- Vehicle information
- Additional work costs
- Route fuel inputs

Route fuel is recalculated when its source distance, fuel type or vehicle consumption changes.

Saving a candidate job updates the source Job object. The calculation engine then calculates the displayed results again.

Candidate jobs can also be removed from the comparison.

The current job can be edited separately and used as the updated comparison baseline.

---

## 13. Personalisation — Prototype UI

The Comparison screen also contains a personalisation interface.

The prototype collects information such as:

- Priorities
- Main priority
- Preferred shifts
- Weekend preference
- Commute preference
- Desired career areas
- Relevant experience

This interface represents the intended direction for personalised Pros & Cons.

In the current MVP, the questionnaire UI exists but the personalised Pros & Cons output is not yet connected to the comparison engine. The interface explicitly displays a placeholder rather than presenting unfinished logic as a completed result.

The core financial and time comparison does not depend on this prototype functionality.

---

## 14. Data Ownership

The application keeps three concepts separate.

### User-entered source data

Examples:

- Pay amount
- Hours
- Shifts
- Working days
- Commute distance and time
- Parking
- Work-related costs
- Route distance
- Vehicle consumption

### Central rules and assumptions

Examples:

- Tax and National Insurance rules
- Weeks per year
- Average weeks per month
- Miles-to-kilometres conversion
- Fuel-price assumptions

### Calculated results

Examples:

- Gross monthly income
- Tax and National Insurance
- Commute cost
- Real Net
- Total Time
- Effective Net per Hour
- Differences versus the current baseline

Calculated results are derived from source data and rules rather than stored as editable form values.

---

## 15. Current MVP Boundaries

The reliable MVP input path is manual entry.

The main input flow supports:

- Car
- Walking
- Remote work

Public transport calculation is not part of the main MVP input flow.

The underlying model and the candidate edit interface contain some support for public transport, but monetary public-transport cost calculation is not implemented. This is therefore treated as incomplete/future functionality rather than a supported core flow.

Other future extensions can include:

- Maps-based route calculation
- Public transport fares and travel data
- Vacancy URL or job-description parsing
- AI-assisted data extraction
- Persistent storage and user accounts

---

## 16. Design Principle

The UI should collect source information in manageable steps while keeping calculation logic outside the React screens.

The intended separation is:

**User input → Form state → Canonical Job model → Calculation engine → Comparison output**

This makes the calculation engine reusable and independently testable, while allowing the user interface to change without rewriting the underlying financial and time calculations.
