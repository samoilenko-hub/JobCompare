"# AI Usage

I used ChatGPT extensively throughout this project, not only for generating code.

I used it as a research, learning and development assistant from the early modelling stage through to implementation and verification.

## Research and problem modelling

I used ChatGPT to help research and understand the rules needed for the initial spreadsheet model and to discuss how those rules should be translated into calculations and formulas."

I also used ChatGPT to help research UK Income Tax and National Insurance rules, different employment and pay structures, work-related costs, commuting assumptions and the normalisation of weekly, monthly and annual values. I used it to help build and review formulas in the spreadsheet. External rules were treated as assumptions to verify rather than facts to accept simply because AI suggested them.

## Product concept exploration

I used ChatGPT to explore how the spreadsheet model could be turned into a user-facing product.

I described the problem, the comparison outputs and the value I wanted the product to provide, and asked ChatGPT to help visualise a more complete version of the experience. I used AI-generated interface concepts to explore how the key benefits could be presented to the user, including side-by-side job comparison, money and time trade-offs, work patterns and a possible personalised pros-and-cons view.

These concepts were exploratory rather than a specification for the final application. I used them to understand the broader product opportunity and then decide which parts were actually necessary for the technical challenge.

## Using AI to clarify product rules
I also used ChatGPT to identify ambiguities in the model before implementing it in code.
Rather than asking ChatGPT to generate the application from a vague description, I used a question-and-answer process to work through how individual parameters should behave. ChatGPT helped identify cases where a rule was not sufficiently defined and presented questions or possible interpretations for me to consider.
These discussions included advertised versus actual working hours, hourly and daily pay, employed versus self-employed calculations, deductible expenses, commute fuel versus fuel used while performing the job, missing or optional values, a not-working baseline, and how editing source inputs should trigger recalculation.
I made the product decisions based on the behaviour I wanted the application to have, and the agreed decisions were then incorporated into the data model and later implemented in TypeScript.
This was one of the main ways I used AI in the project: not only to help write code, but to expose ambiguous assumptions before they became implementation problems.

## Planning the calculation engine
I used ChatGPT to help translate the agreed data model and spreadsheet logic into a technical plan for the calculation engine.
We broke the calculation process into smaller responsibilities, including pay normalisation, Income Tax, National Insurance, commuting costs, additional work costs, working time and comparison calculations. I used these discussions to understand how the spreadsheet logic could be separated into independent TypeScript modules rather than implemented as one large calculation.
ChatGPT also helped me think through dependencies between calculations and the recalculation flow when a user edits an existing job or the current baseline.
I reviewed these decisions against the data model and the behaviour already established in the spreadsheet before using the plan as the basis for implementation.