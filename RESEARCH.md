"# Research and Development Notes

## Starting with a spreadsheet

Before writing any application code, I first modelled the problem in Google Sheets.

I started with the results I wanted to see when comparing jobs: monthly gross income, real monthly income after relevant costs, total time committed each week, and effective net income per hour.

I then worked backwards from those outputs to identify the information and calculation rules required to produce them.

Using a spreadsheet allowed me to change assumptions quickly, inspect individual calculations and test several different types of job before deciding how the software itself should work."

## Working backwards from the output

The spreadsheet helped me separate the problem into three parts:

1. Inputs supplied by the user, such as pay, working hours, shifts, commute and work-related costs.
2. Rules and assumptions used by the calculation, such as tax rates, National Insurance thresholds, fuel prices and unit conversions.
3. Comparable outputs that could be calculated consistently for every job.

I started by defining the outputs I wanted the comparison to show and then worked backwards to identify the inputs and rules required to calculate them.

This separation later became the basis for the application's data model and calculation engine.