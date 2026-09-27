# Research and Development Notes

## Starting with a spreadsheet

Before writing any application code, I first modelled the problem in Google Sheets.

I started with the results I wanted to see when comparing jobs: monthly gross income, real monthly income after relevant costs, total time committed each week, and effective net income per hour.

I then worked backwards from those outputs to identify the information and calculation rules required to produce them.

Using a spreadsheet allowed me to change assumptions quickly, inspect individual calculations and test several different types of job before deciding how the software itself should work.

## Working backwards from the output

The spreadsheet helped me separate the problem into three parts:

1. Inputs supplied by the user, such as pay, working hours, shifts, commute and work-related costs.
2. Rules and assumptions used by the calculation, such as tax rates, National Insurance thresholds, fuel prices and unit conversions.
3. Comparable outputs that could be calculated consistently for every job.

I started by defining the outputs I wanted the comparison to show and then worked backwards to identify the inputs and rules required to calculate them.

As the spreadsheet developed, I also started to formalise product rules that were not purely financial, including shift time categories, weekday and weekend definitions, additional cost handling and assumptions for specific job scenarios. This allowed me to test parts of the product logic before implementing them in code.

This separation later became the basis for the application's data model and calculation engine.

## Creating a reference model

Once the spreadsheet calculations were working, I kept a set of deliberately different job scenarios as reference cases.

They included different pay bases, employed and self-employed work, full-time and part-time roles, different commuting methods and additional work costs.

I wanted these scenarios to give me known inputs and expected outputs before I moved the calculations into code. This gave me something independent to compare the TypeScript implementation against.

## Exploring the product idea

After validating the basic calculation model, I explored what a more complete version of the product could look like and created interface concepts before deciding what belonged in the challenge MVP.

## Defining the MVP scope

The initial product concept was broader than I needed for the technical challenge, so I prioritised the features according to whether they were necessary to demonstrate the core idea.

For the MVP I decided to focus on the complete comparison path: capturing the user's current situation and candidate jobs, normalising different pay structures and working patterns, accounting for commute and work-related costs, and producing comparable financial and time outputs. The core journey therefore became:

user input → calculation engine → comparison

I deliberately left features that were not necessary to prove this journey outside the MVP.

Two examples were Maps API integration to calculate commuting distance and travel time automatically, and AI-assisted job advert parsing to extract available information such as employer, role, pay, working hours, schedule and location and use it to pre-fill the comparison form for user verification.

Both could reduce manual data entry, but they would also introduce external APIs, additional error handling and more complexity without changing the core comparison problem I wanted to demonstrate.

I therefore kept these as natural future improvements rather than dependencies of the MVP.

## Moving the model into code

Once the spreadsheet model was sufficiently defined, I started translating its structure into code.
I deliberately did not start with the user interface. I first wanted to create a technical foundation for the calculation engine: a consistent data model for jobs and working conditions, a separate set of calculation rules and assumptions, and small calculation functions responsible for individual parts of the model.

The spreadsheet remained my reference model during this process. The aim was not simply to reproduce spreadsheet cells in TypeScript, but to turn the same underlying rules into a calculation engine that could later be tested independently and used by the application.
This also gave me a way to develop the project incrementally: first define how the data should be represented, then implement the rules and calculations, verify the results against the reference scenarios, and only after that build the user interface around the engine.

## Resolving ambiguous product rules

Before implementing the data model in TypeScript, I used ChatGPT to work through cases where the spreadsheet alone did not fully define how the application should behave.
I treated these discussions as product and modelling decisions rather than asking AI to choose the rules automatically. We worked through questions such as the difference between advertised and expected actual working hours, hourly and daily pay, self-employed revenue and expenses, commute fuel versus fuel used while performing a job, ownership of calculated values, and what should happen when an existing job or the current baseline is edited.
For each case I decided which behaviour made sense for the product and then incorporated the agreed rule into the data model. The model was revised as these decisions became clearer before I started implementing the calculation engine.
This step was important because it converted assumptions that could otherwise remain implicit in a spreadsheet into explicit rules that could be implemented and tested in code.