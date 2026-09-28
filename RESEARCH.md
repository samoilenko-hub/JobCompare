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


## Planning the calculation engine
Before implementing the calculation functions, I created a calculation engine plan based on the data model and the spreadsheet reference cases.
I broke the calculation process into smaller responsibilities such as pay normalisation, Income Tax, National Insurance, commuting costs, additional work costs, working time and job comparison. The intention was to keep these calculations separate from the user interface so that the engine could be understood and tested independently.
I also defined how recalculation should work when source data changes. Calculated values would not be edited directly. Instead, editing a job or the current situation would update the source inputs and run the same calculation functions again. Changing the current baseline would therefore recalculate its comparison with every candidate job.
This planning step gave me a clearer structure for translating the spreadsheet model into small TypeScript modules rather than reproducing the spreadsheet as one large calculation.

## Implementing the calculation engine
Before building the user interface, I decided to separate the spreadsheet model into smaller software components rather than reproduce all of the logic in one large calculation.
I first classified the information and responsibilities in the model into several areas: job and working-condition data, calculation rules and assumptions, calculated results, and the individual calculations required to transform the inputs into those results.
Based on this classification, I designed the TypeScript implementation around separate types, rules and calculation modules. Individual responsibilities such as pay normalisation, Income Tax, National Insurance, working time, shifts, commuting and work-related costs were kept separate and then combined by the main job calculation and comparison functions.
I chose this modular structure because I wanted the calculation logic to remain independent from the user interface and easier to understand, verify, change and extend as the product developed. For example, a future change to a tax rule or commuting calculation should not require rewriting the user interface or unrelated parts of the calculation engine.
I also converted the deliberately different spreadsheet scenarios into reference job data that the calculation engine could process. This created a bridge between the original spreadsheet model and the TypeScript implementation and gave me known scenarios that I could use to verify the engine before building the user interface.
I deliberately did not introduce a database for the MVP. Persistent storage was not necessary to demonstrate the core path of user input → calculation engine → comparison output. For the technical challenge, keeping the entered data in application state was sufficient and avoided introducing a persistence layer, additional integration and error handling that would not help validate the main calculation problem. Saving user scenarios and job comparisons would be a natural extension for a production version.



## Setting up the application and verifying the calculation engine

Once the calculation engine had been implemented, I set up the application environment using React, TypeScript and Vite.

I kept the calculation engine separate from the React user interface. React would be responsible for collecting and presenting information, while the existing TypeScript calculation modules would remain responsible for processing the job data.

Before building the full user interface, I wanted to verify that the calculation engine produced the expected results. I therefore connected the predefined reference job scenarios to the application and created a simple reference-check screen.

Each reference job was processed through the same calculation functions that would later be used by the application. Candidate jobs were also compared with the current job baseline using the comparison engine. I displayed the results in a table structured similarly to the spreadsheet reference model, including gross monthly income, real net monthly income, total weekly time, effective net income per hour and the differences against the current situation.

I then compared the calculated results with the expected results from the spreadsheet reference model. The displayed values for all eight reference scenarios matched the spreadsheet values at the displayed rounding precision.

Finally, I ran npm run build, which performed TypeScript validation (tsc --noEmit) followed by a Vite production build. Both completed successfully. Together with the reference-scenario comparison, this gave me confidence that the calculation engine and application setup were working correctly before I started building the full user interface.


## Formalising the functional requirements

After verifying the calculation engine against the spreadsheet reference scenarios, I formalised the functional requirements before building the full user interface.

Many of the underlying rules already existed in the spreadsheet, data model and calculation engine, but they had been developed at different stages of the project. I wanted a single description of how the product should behave from the user's point of view before translating those rules into screens and forms.

This included defining how different pay bases should be handled, keeping advertised/paid hours separate from expected actual hours, distinguishing shifts from stated working days, and clarifying the different treatment of employed and self-employed work. I also formalised the distinction between commuting and additional work costs, including the case of delivery work where travelling from home to a depot and driving a delivery route are two separate costs.

Another important requirement was the distinction between a known zero and missing data. For example, free parking is genuinely £0, while unknown parking cost is missing information. I did not want the application to silently replace missing inputs with zero where doing so could materially change the result.

I defined the compact comparison around seven primary metrics: Estimated Gross per Month, Real Net per Month, Income Difference versus Current, Total Time per Week, Time Difference versus Current, Effective Net per Hour and Work Pattern. More detailed calculations could remain available separately.

I also explored a personalised comparison layer based on priorities, job preferences, experience and career direction. I decided that these should produce individual Pros & Cons and priority matches rather than an overall score or a recommendation of a single "best" job. The purpose of the product is to expose relevant trade-offs rather than make the decision for the user.

Finally, I used the requirements to define the MVP boundary. Manual job entry would be the reliable input path. Features such as vacancy parsing, AI extraction, maps integration, public transport calculations, accounts and backend storage were left as future extensions rather than adding complexity before the core comparison journey was working.

With the functional behaviour defined more explicitly, the next step was to design the user flow: deciding how the required source inputs should be divided into screens and collected in a manageable sequence.

## Designing and implementing the current-situation input flow

With the functional requirements defined, I translated the source inputs into a sequence of smaller screens rather than putting the entire form on one page.

The current-situation flow starts by establishing whether the user is employed, self-employed or not working. For a working baseline, the application then collects current-job information, pay and schedule, reusable home and vehicle information, and finally commute and work-related costs. A not-working baseline skips the current-job and pay screens because those inputs do not apply.

I kept the form state in the React application while the user moves backwards and forwards between screens. This allowed me to separate data entry from calculation and to preserve entered values without introducing persistent storage.

I also separated home and vehicle information from job-specific commute information. Home postcode and vehicle characteristics can potentially be reused across several candidate jobs, while commute distance, travel time and parking belong to a particular job.

Work-related costs required a similar distinction. Rather than using a single monthly cost field, I allowed multiple costs with their own description, amount and frequency. I also kept additional driving performed during the workday separate from the normal home-to-work commute. Route fuel can therefore be calculated from route distance, fuel type and vehicle consumption without treating it as commuting.

I implemented the flow incrementally and manually checked each stage in the browser. I tested forward and back navigation, preservation of entered form state, the different path for a not-working baseline, adding and removing work-related costs, and the conditional route-fuel inputs. I also ran the TypeScript validation and production build as the flow developed.

At this stage I had a working input path for the user's current situation. The next step was to connect that source data to the existing calculation engine and present the calculated baseline in the Comparison view.


## Connecting the current baseline to the calculation engine

Once the current-situation input flow was working, I connected the form data to the existing calculation engine.

I added an adapter between the React form state and the canonical Job model. The forms keep values in a format that is convenient for data entry, while the calculation engine expects typed job data with structured pay, schedule, commute, vehicle and work-cost information. Keeping this conversion in a separate adapter allowed the calculation engine to remain independent from the user interface.

For an employed or self-employed current situation, the application now converts the entered source data into a Job and passes it through the same calculation engine that had previously been verified against the spreadsheet reference scenarios. The resulting baseline displays monthly gross income, Real Net, total weekly time, effective net income per hour and work pattern.

A Not Working baseline follows a separate path because there is no current Job to calculate. It is represented in the comparison as zero income and zero work-related time, with effective net income per hour not applicable.

I manually tested both paths. For a working baseline I entered a complete example through the UI and checked that the descriptive information and calculated outputs reached the Comparison screen. I also tested the Not Working path and confirmed that it produced the intended zero baseline.

This completed the current-situation side of the end-to-end path from user input to calculated output. The next step was to add candidate jobs and compare their results against this baseline.

## Adding candidate jobs and comparison

After completing the current baseline, I added the candidate-job flow so that the application could perform its main task: comparing alternative jobs against the user's current situation.

The candidate flow collects job details, pay and schedule information, commute details and additional work costs. Home and vehicle information is not requested again because it belongs to the user rather than to an individual job.

Candidate form data is converted through the same form-to-Job adapter and passed to the same calculation engine as the current job. The Comparison view can display multiple candidate jobs alongside the current baseline and shows their calculated gross pay, Real Net, total weekly time, effective net income per hour and work pattern.

I also added comparison values for Real Net and total weekly time so that the user can see the financial and time difference relative to the current situation rather than comparing headline salary alone.

I manually tested the complete flow by adding multiple candidate jobs. A fully completed candidate produced calculated results and differences against the current baseline. I also observed that an incomplete candidate propagated No data for calculations that could not be completed instead of silently treating missing inputs as zero.

At this stage the core MVP journey was working end to end: enter the current situation, add alternative jobs, calculate each option consistently and compare the results in one view.

There is some duplication between the React forms used for the current job and candidate jobs. A future refactoring could consolidate these into reusable form components. I deliberately left this outside the current scope because the underlying Job model, adapter and calculation engine are already shared, and completing and verifying the MVP was a higher priority than refactoring working UI code.

## End-to-end verification against the reference model

With the complete manual input and comparison flow working, I performed a second level of verification against the spreadsheet reference model.

During development I had created several temporary candidate jobs while testing the forms and comparison screen. I first added a simple Remove action so these test entries could be cleared and the verification could start from a clean state.

I then manually re-entered the current situation and all seven candidate jobs from the reference set through the application's normal input screens. This was intentionally different from the earlier calculation-engine verification, which had processed predefined Job objects directly. This time I wanted to test the complete user-facing path:

user input → form state → Job model → calculation engine → comparison output

I compared the resulting outputs with the spreadsheet reference values. The first pass exposed several discrepancies in the manually entered source data for the PKL, XYZ and One Stop scenarios. Investigating these differences was useful because it demonstrated that the calculation engine itself was producing consistent results, while also revealing a practical usability problem: correcting an existing candidate required re-entering the job.

I therefore added an Edit action to the Comparison view. The edit modal allows the source inputs of an existing candidate job to be changed and then passes the updated Job through the same calculation path again. Calculated outputs remain derived values rather than editable fields.

Using Edit, I corrected the source inputs for the affected PKL, XYZ and One Stop scenarios and repeated the comparison. After those corrections, the outputs for the manually entered current situation and all seven candidate jobs matched the spreadsheet reference outputs at the displayed rounding precision.

This completed an end-to-end verification of the MVP using the same manual input path available to a user. It also produced a verified set of source inputs that can now be reused as demo data without bypassing or changing the underlying calculation logic.

## Adding verified demo data for reviewers

After completing the end-to-end verification, I reused the verified source inputs as a demo dataset.

The purpose of this was not to replace the normal user journey. A user can still enter their current situation, add candidate jobs and build a comparison manually. However, this project is also intended to be reviewed as a technical challenge, and requiring a reviewer to manually enter a current situation and seven candidate jobs would make it unnecessarily difficult to see the completed comparison experience.

I therefore added a Load demo data option to the initial Current Situation screen. It provides a second, faster path through the application:

Home → Load demo data → completed Current + 7 job comparison

The demo dataset contains the same current situation and seven candidate jobs that were manually entered, corrected and checked during the end-to-end reference verification. It is therefore based on verified source inputs rather than a separate set of values created only for presentation.

The demo loading logic populates the normal application state and then opens the Comparison view. The existing calculation engine remains unchanged, and the normal manual input journey remains available alongside the demo path.

## Adding automated regression testing

After completing the manual end-to-end verification and capturing the verified demo dataset, I added a focused automated regression test for the calculation and comparison logic.

The spreadsheet reference model remained the independent source of expected outputs. Rather than generating expected values from the application itself, I used the values that had already been checked during the spreadsheet and end-to-end verification stages.

The Vitest regression suite covers all eight reference scenarios: the current situation and seven candidate jobs. For each scenario it checks key calculated outputs including monthly gross pay, Real Net, total weekly time, effective net income per hour and work pattern.

A second set of tests checks the seven candidate comparisons against the current situation, including monthly income difference, weekly time difference and effective net income per hour difference. This is particularly important because the same numerical difference can have a different interpretation in the UI: additional income is positive, while additional work-related time is a trade-off.

The completed regression suite contains 15 tests and passes against the verified reference outputs. This provides a repeatable check that future changes to the calculation or comparison logic do not unintentionally change the results already validated against the spreadsheet model.

The production build was also run successfully after adding the tests.
