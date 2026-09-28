# JobCompare

JobCompare is a small web application for comparing the real financial and time impact of different jobs.

## The problem

I started this project while looking for work myself. I found that job adverts were surprisingly difficult to compare directly. Some advertised hourly pay, others annual salaries or day rates. Working hours, shift patterns, commuting time and work-related costs could also vary significantly.

Simply comparing the advertised pay did not tell me which job would actually leave me better off or how much of my time each option would require.

The best option is also not always the job with the highest salary. Depending on someone's circumstances, a part-time job, a shorter commute or fewer working hours may be more valuable. A higher-paying job may also become less attractive once commuting time, fuel, parking and other work-related costs are taken into account.

## Goal

My goal was to turn these different job conditions into a consistent comparison of money and time.

Rather than trying to decide which job is "best", JobCompare is intended to make the real trade-offs visible — how much money each option actually provides, how much time it requires, and what additional costs come with it — so that the user can make a more informed decision based on their own circumstances and priorities.

## Features

JobCompare allows users to compare employment options based on real financial impact and time commitment.

The comparison includes:

- gross income and normalised pay structures;
- estimated tax and National Insurance;
- commuting time and costs;
- additional work-related expenses;
- total weekly time commitment;
- effective net income per hour;
- work pattern and schedule.

The application supports:

- entering a current work situation;
- adding multiple candidate jobs;
- comparing alternatives side by side;
- editing existing candidate jobs;
- loading verified demo data for quick review.


## How it works

The application separates user input from calculation logic:

``` text
User input
    ↓
Form state
    ↓
Job model
    ↓
Calculation engine
    ↓
Comparison output
```

Calculated values are derived from source inputs and are not edited
directly. Updating source information causes the same calculation engine
to run again.

## Running locally

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

Create a production build:

``` bash
npm run build
```

Run automated regression tests:

``` bash
npm test
```

## Project structure

``` text
src/
├── calculations/     # calculation engine
├── types/            # TypeScript domain models
├── adapters/         # conversion from UI forms to Job model
├── rules/            # calculation assumptions
├── testData/         # verified reference and demo data
└── *.tsx             # React application screens
```

## Verification

The calculation engine was verified against an independent spreadsheet
reference model.

The project includes automated regression tests covering:

-   current situation calculations;
-   candidate job calculations;
-   comparison differences against the current situation.

The verified demo data available in the application is based on the same
reference scenarios used during manual end-to-end verification.

## Future improvements

The current MVP focuses on making job trade-offs visible through
financial and time-based calculations.

Potential future improvements include:

-   automatic job advert parsing to extract salary, hours and location
    details;
-   integration with mapping APIs for automatic commute distance and
    travel time calculation;
-   personalised comparison insights based on user priorities and
    circumstances;
-   more advanced recommendation logic to highlight relevant trade-offs.

These features were intentionally kept outside the current MVP scope to
first validate the comparison model and calculation engine.

## Documentation

Additional project documentation:

-   `RESEARCH.md` --- research process, modelling decisions,
    implementation steps and verification approach.
-   `AI.md` --- how AI tools were used during development, investigation
    and testing.


