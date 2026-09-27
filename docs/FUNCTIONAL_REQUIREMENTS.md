# JobCompare — Functional Requirements

**Status:** Agreed MVP requirements  
**Purpose:** Define what JobCompare must do and the business rules it follows. Technical implementation is documented separately.

## 1. Product purpose
JobCompare compares job opportunities using real financial and time impact, not advertised salary alone. It shows comparable facts, Pros & Cons and personalised matches. It does not produce an overall job score or declare a “best job”.

## 2. Current situation
The baseline can be a current job or Not Working. A current job uses the same core model as candidate jobs.

For Not Working: Gross = £0, Net = £0, Real Net = £0, work costs = £0, work time = 0, commute = 0 and Effective Net/hour = not applicable. Candidate Effective Net/hour is still calculated, but its difference versus a Not Working baseline is shown as “—”.

## 3. Job information
Store company name, job title, employment type (Employed/Self-employed), contract type, Full-time/Part-time status where known, location, pay, schedule, commute and work costs.

Contract examples: Permanent; Temporary; Fixed-term; Fixed-term · 6 months; Temporary · Maternity cover. Contract information is context, not one of the seven Decision Summary metrics.

## 4. Pay basis and normalisation
Accept Hour, Day, Week, Month and Year. The user enters pay as advertised; JobCompare normalises it for comparison.

Hourly pay uses paid/advertised hours. Daily pay uses paid shifts/week. Week, Month and Year are converted consistently using central rules. The main comparable output is **Estimated Gross / Month**. Retain the original advertised pay and basis for detail views.

## 5. Advertised vs actual hours
Keep Advertised/Paid Hours separate from Actual Expected Hours.

Advertised/paid hours determine pay where relevant, especially hourly jobs. Actual Expected Hours represent how much time the work itself realistically consumes and drive Total Time, More Free Time, Effective Net/hour and work-life comparison.

Fixed weekly/monthly/annual salary does not change when actual hours change. Daily pay depends on paid shifts. If actual hours are unknown, initialise them from advertised hours and allow editing. No separate unpaid-break field is required in the MVP.

## 6. Shifts and working days
`shiftsPerWeek` is the actual average number of work outings/shifts. It drives commute frequency, daily pay, parking/workday costs and other per-workday calculations.

`workingDays` stores the stated days on which the job is scheduled/can be scheduled. It must not substitute for shifts/week.

For MVP weekend logic, Saturday/Sunday are derived from the stated Working Days.

## 7. Shift category
Categories: Day, Early morning, Evening, Night, Variable.

The system calculates the category from schedule data. Overlap priority is **Night > Evening > Early > Day**. Variable overrides fixed-time categories when the schedule varies.

The user can correct the automatic result. Store `calculatedShiftCategory`, optional `shiftCategoryOverride`, and `effectiveShiftCategory`. The effective value drives comparison and personalisation.

## 8. Commute
MVP methods: Car, Walking, Remote. Public transport is future scope.

Car can use one-way distance/time, fuel consumption, fuel price/type and parking. Walking has £0 fuel and £0 parking but its travel time is included. Remote has zero commute distance, time and cost.

**Weekly commute time = one-way commute time × 2 × shifts/week.**

## 9. Additional costs
Allow multiple costs with Name, Amount and Frequency. Frequencies: Workday, Week, Month, Year.

Workday costs use `shiftsPerWeek`, never the count of listed Working Days. Commute costs and Additional Costs remain distinguishable in detailed results.

## 10. Delivery-driver route fuel
Delivery work can have both:
- Commute fuel: Home ↔ Depot
- Route fuel: fuel consumed while delivering

Route fuel can be calculated from route distance/workday × vehicle consumption × fuel price and becomes an Additional Expense. Both ultimately affect Real Net but remain separately visible in detail.

## 11. Employed calculation
**Gross → Tax + Employee NI → Net → Commute Costs → Additional Costs → Real Net**

## 12. Self-employed calculation
For MVP, everything explicitly entered under Additional Expenses is treated as an expense before tax.

**Gross Revenue → Additional Expenses → Estimated Profit → Tax + applicable NI → Commute Costs → Real Net**

Examples include van rental and delivery-route fuel. Home ↔ workplace/depot commute is not an Additional Expense; it is deducted after estimated tax/NI. No Business Expense Yes/No toggle is required.

## 13. Real Net
Real Net is the primary financial comparison value.

For employed work: **Real Net = Net after Tax/NI − Commute Costs − Additional Costs.**

For self-employed work it is the amount remaining after Additional Expenses, estimated Tax/NI on resulting profit, and commute costs.

Real Net drives Income Difference, More Money and Effective Net/hour. Gross and ordinary Net remain informational values.

## 14. Total Time
**Total Time/week = Actual Work Hours/week + Commute Time/week.**

Commute frequency uses shifts/week. Total Time drives More Free Time, Time Difference and Effective Net/hour.

## 15. Effective Net/hour
**Effective Net/hour = Real Net/month ÷ Total Time/month.**

Total Time/month is derived from weekly time using the central weeks-per-month rule. Commute is included. If Total Time is zero, the rate is not applicable, not £0/hour.

## 16. Decision Summary
The compact comparison has exactly seven primary metrics:
1. Estimated Gross / Month
2. Real Net / Month
3. Income Difference vs Current
4. Total Time / Week
5. Time Difference vs Current
6. Effective Net / Hour
7. Work Pattern

Detailed calculations are shown separately.

## 17. Work Pattern
Work Pattern is factual, not evaluative. Combine effective shift category with actual stated weekend work, e.g. `Day · No weekend work`, `Evening · Saturday`, `Variable · Saturday + Sunday`.

Personalisation separately decides whether this is good or bad for the user.

## 18. Priorities
Priorities describe what the user wants to improve relative to the baseline:
- More money
- More free time
- Free weekends
- Preferred shift
- Short commute
- Career development

Multiple selections are allowed. Priorities do not filter other Pros & Cons.

## 19. Main Priority
Main Priority must be one of the selected Priorities. If exactly one Priority is selected, it becomes Main Priority automatically. If none are selected, there is no Main Priority.

It changes visual emphasis only, never calculation/classification.

## 20. Priority Match
A Priority is a Match only when the candidate produces a genuine improvement or directly satisfies the requested state. Equality is not a Match.

The UI can show `Matches 2 of your 3 priorities` plus individual matches. No overall job score or percentage is produced.

## 21. More Money
Use Real Net only.

**Income Difference = Candidate Real Net/month − Baseline Real Net/month.**

Positive = Pro/Match; negative = Con/No Match; zero = Neutral/No Match.

## 22. More Free Time
Use Total Time, including commute. Lower than baseline = Pro/Match; higher = Con/No Match; equal = Neutral/No Match.

A Not Working baseline receives no special exception: taking a job increases work-related time.

## 23. Free Weekends
Strict MVP rule: both Saturday and Sunday must be free.

Neither worked = Match/Pro. Working Saturday, Sunday or both = No Match/Con. One free weekend day is not sufficient.

## 24. Preferred Shift
The user can select one or more acceptable categories. Match requires exact category membership.

Day preference + Day job = Match. Day preference + Variable job = No Match. Day+Evening preference + Variable job = No Match. Variable preference + Variable job = Match.

If no preferred shift is specified, do not evaluate the factor.

## 25. Short Commute
Compare **total weekly commute time**, not distance or cost.

Lower weekly commute time = Pro/Match; higher = Con/No Match; equal = Neutral/No Match. Distance and commute cost remain factual detail values.

## 26. Career areas
MVP uses simple manually entered career/role labels rather than a complete occupation taxonomy. Users can provide multiple experience areas and desired career directions.

An expanded taxonomy, autocomplete, normalised occupation IDs and automated/AI vacancy classification are future features.

## 27. Career Direction Fit
Career Direction Fit is independent from Experience Fit.

If any Job Career Area matches any Desired Career Direction → Match/Pro. If directions are specified but none match → Con. If none are specified → do not evaluate.

If Career Development is selected as a Priority, at least one Desired Career Direction is required.

## 28. Experience
Allow up to five experience areas.

Bands: No experience, <1 year, 1–2 years, 3–5 years, 6–10 years, 10+ years.

MVP does not require vacancy required-years input. Automatic extraction/comparison of required experience is future scope.

## 29. Experience Fit
Compare Job Career Areas with user Experience Areas. If several areas match, use the strongest relevant experience.

- No matching/direct experience → No direct experience / Con
- <1 or 1–2 years → Some experience / Pro
- 3–5, 6–10 or 10+ years → Strong experience match / Pro

Display the actual band where relevant.

## 30. Job Preferences
Job Preferences describe what kind of job the user accepts/wants and are separate from Priorities. They can include contract type, Full-time/Part-time and preferred shift.

Both Priorities and Preferences can contribute to Pros & Cons, but they remain separate UI concepts.

## 31. Contract preference
Allow one or more acceptable types: Permanent, Temporary, Fixed-term.

Matching any selected type = Match/Pro. Matching none = No Match/Con. Selected acceptable types are not ranked. If no preference is specified, show contract factually but do not evaluate it.

## 32. Full-time / Part-time preference
Use the vacancy's stated Full-time/Part-time status; do not infer it from an arbitrary hours threshold.

The user can accept Full-time, Part-time or both. Matching any selected option = Match/Pro; otherwise Con. If unspecified, do not evaluate.

## 33. Multiple acceptable values
For a multi-select preference, matching any one selected acceptable value is sufficient. Selected alternatives are not ranked.

## 34. Unspecified preferences
Never infer a preference. If it is not supplied, show factual job information where relevant but generate no Pro/Con for that preference.

## 35. Pros & Cons
Calculate and show all applicable Pros & Cons supported by available data, not only selected Priorities.

Selected Priorities are highlighted; Main Priority is highlighted more strongly. Personalisation changes emphasis, not underlying facts. No overall score or “best job” verdict.

## 36. Neutral
Internally support Pro, Con and Neutral. Neutral factors are omitted from the compact Pros & Cons UI, while underlying factual values remain available elsewhere.

## 37. Priority vs Preference results
Do not combine Priorities and Job Preferences into one score/count.

Keep `Matches X of Y priorities` separate from individual Job Preference matches. Do not show `4 of 6` or a combined percentage.

## 38. Missing data
If required data is unknown, show `No data` and require the user to provide it. Do not silently invent values that can materially change the result.

Explicit central assumptions/rules are allowed and are not Missing Data.

## 39. Zero vs No Data
`0` is a known zero. `No data` is unknown. Never treat them as equivalent.

Examples: Remote commute = £0; known free parking = £0; unknown parking = No data.

## 40. Precision and rounding
Keep full numeric precision throughout calculations. Do not round intermediate values. Round only for user-facing display.

## 41. Editing and recalculation
Users edit source inputs, never calculated outputs. Input changes trigger recalculation of results, comparisons, Pros & Cons and Priority Matches.

## 42. MVP input approach
Manual entry is the reliable MVP path. Vacancy parsing, AI extraction, maps, public transport, accounts and backend storage are not required.

Future functionality may be shown only if clearly disabled/identified as future scope.

## 43. Future extensions
Potential extensions include vacancy URL/JD parsing, AI extraction, occupation taxonomy/autocomplete, experience-requirement extraction, maps commute data, public transport/fare calculations, richer job-security preferences, benefits/household logic, vehicle wear/depreciation, persistent accounts/backend and richer scenarios.
