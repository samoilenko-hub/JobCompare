# AI Usage

I used ChatGPT extensively throughout this project, not only for generating code.

I used it as a research, learning and development assistant from the early modelling stage through to implementation and verification.

## Research and problem modelling

I used ChatGPT to help research and understand the rules needed for the initial spreadsheet model and to discuss how those rules should be translated into calculations and formulas.

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

## Implementing the calculation engine
I used ChatGPT extensively during this stage because TypeScript and this type of application architecture were new to me.
I used ChatGPT as a learning and development assistant while translating my spreadsheet model and product rules into software. This included discussing how the information and calculations could be classified into separate responsibilities, reviewing the proposed architecture, understanding TypeScript concepts and syntax, and helping me implement the types, rules and calculation modules in code.
I made the product and modelling decisions about what the application needed to represent and calculate, while ChatGPT helped me translate those decisions into a technical structure and working TypeScript implementation. I also used it to explain generated code and unfamiliar concepts so that I could understand how the different parts of the calculation engine worked together.
I used AI suggestions as something to validate rather than as an authoritative answer. The spreadsheet remained an independent reference model containing deliberately different job scenarios and expected results. I used those scenarios to check the TypeScript calculation engine and investigate differences between the two implementations rather than assuming that generated code was correct because it compiled or ran successfully.
I also used ChatGPT to discuss architectural scope, including whether the MVP required persistent storage. I decided not to introduce a database because persistence was not necessary to demonstrate the core calculation and comparison journey and would have added complexity outside the main purpose of the technical challenge.

## Setting up the application and verifying the calculation engine

I used ChatGPT extensively while setting up the React, TypeScript and Vite application around the existing calculation engine.

As this application structure and development environment were new to me, I used ChatGPT not only to help generate code but also to understand what I was installing and why it was needed. This included understanding the roles of Node.js and npm, React, TypeScript and Vite, the purpose of the main project configuration files, and how the React application could use the existing TypeScript calculation modules without moving the calculation logic into the user interface.

During the initial environment setup, I encountered a problem because Node.js and npm were not installed on my machine. I used ChatGPT to troubleshoot this and initially tried installing Node.js through Homebrew. This began pulling in and building a large number of dependencies and was taking much longer than I expected for what should have been a relatively simple setup step.

Rather than continuing with the suggested approach automatically, I questioned whether that level of complexity was necessary for the task. I stopped that installation path and used the official Node.js installer instead, which provided Node.js and npm directly. I was then able to install the project dependencies and run the React, TypeScript and Vite application normally.

This was a useful example of where an AI-suggested technical approach was possible but was not the most appropriate approach for my situation. When the behaviour did not look proportionate to the problem, I reconsidered the suggestion and chose a simpler solution rather than continuing to follow it automatically.

Once the application environment was working, I used ChatGPT to help connect the predefined reference scenarios to the application and create a simple reference-check screen. The purpose of this screen was not to build the final user interface, but to pass the existing reference inputs through the calculation and comparison functions and make the resulting values easy to compare with my spreadsheet reference model.

I did not treat the AI-assisted implementation as evidence that the calculations were correct. I used the spreadsheet model as an independent reference and compared the application results against the expected outputs for all eight predefined job scenarios. The displayed results matched the spreadsheet reference values at the displayed rounding precision.

I also ran the TypeScript compiler validation and Vite production build successfully before continuing with the full user interface.


## Using AI to formalise the functional requirements

I used ChatGPT extensively to help formalise the functional requirements before building the full user interface.

By this stage, many of the rules already existed in the spreadsheet model, data model and calculation engine. I used ChatGPT to review those decisions, identify ambiguous cases and help turn them into explicit product behaviour.

The process was conversational rather than asking AI to generate a specification from a blank prompt. I described how I wanted the product to behave, and ChatGPT helped me identify questions and dependencies that needed a clear decision. These discussions included pay bases, advertised versus actual hours, shifts and working days, employed versus self-employed calculations, commuting, additional expenses, delivery-route fuel, missing values, work patterns, editing and recalculation.

This was useful because some inputs affect several parts of the model. For example, shifts per week can affect daily pay, commute frequency, parking and workday-based costs. Similarly, treating an unknown value as zero could make a calculation appear complete while changing the result.

I also used ChatGPT to explore the personalised comparison concept, including priorities, preferences, experience, career direction and Pros & Cons. I decided not to combine these into an overall job score. Personalisation could highlight relevant matches and trade-offs, but the application should not decide which job is best for the user.

ChatGPT also helped me challenge the scope of the MVP. We discussed features such as public transport calculations, maps integration, vacancy parsing, AI extraction and persistent storage. I decided to keep these outside the core MVP where they would require additional data sources or infrastructure without being necessary to demonstrate the main comparison journey.

I did not treat AI-generated suggestions as requirements automatically. I checked the proposed behaviour against the spreadsheet model, the TypeScript data structures and the calculation engine, and made the final product decisions where alternatives existed.

Once these requirements were explicit, I could use them together with the existing data model to design the user flow and decide which information should be collected on each screen.

## Using AI to build the current-situation input flow

I used ChatGPT while translating the functional requirements and user-flow decisions into React screens and application state.

Because React and TypeScript were still new to me, I used ChatGPT to help me understand how the screens should share state, how navigation between screens could be represented, and how the form draft types related to the source data that would later be passed to the calculation engine.

I built the flow incrementally rather than asking AI to generate the complete final application in one step. I added and checked the Current Situation, Current Job, Current Pay & Schedule, Home & Travel and Current Commute & Costs stages progressively, running the application and testing the navigation after each part.

During this process I used ChatGPT to help review the relationship between the UI and the existing data model. One example was the handling of work-related costs. An initial current-job screen used a single monthly work-cost field, but this was less flexible than the model already defined for job-specific costs. I decided to use the more general structure instead: multiple costs with their own frequencies, plus a separate route-fuel input for jobs involving additional driving during the workday.

I did not rely on a successful code generation step as verification. I manually moved backwards and forwards through the screens, checked that entered state was preserved, tested the employed and not-working paths, added and removed work-related costs, enabled the conditional route-fuel fields, and repeatedly ran the TypeScript validation and production build.

This incremental process helped me understand how React state, typed form data and screen navigation worked together before connecting the completed input flow to the calculation engine.


## Using AI to connect the current baseline to the calculation engine

I used ChatGPT to help connect the completed current-situation forms to the calculation engine without moving calculation logic into the React screens.

ChatGPT helped me review the existing form-to-Job adapter and understand its role as the boundary between UI-oriented form state and the canonical Job model used by the calculation engine. I checked that the adapter could represent the current form structure, including multiple additional work costs and route-fuel inputs, before using it for the current baseline.

I then used ChatGPT to help wire the adapter, calculation engine and Comparison screen into the React flow. Rather than assuming the integration worked because the application compiled, I entered a complete working example manually and checked that the form values produced calculated results in the Comparison view. I also tested the separate Not Working path and confirmed its zero baseline behaviour.

This gave me an end-to-end check of the path from manually entered source data through the typed Job model and calculation engine to visible output before adding candidate jobs.

## Using AI to add the candidate-job comparison flow

I used ChatGPT extensively while implementing the candidate-job comparison flow, including generating and modifying React and TypeScript code.

We compared the candidate forms with the current-job forms and identified that most of the information was structurally similar. I considered refactoring them into shared React components, but decided not to expand the scope at this stage. The underlying Job model, form-to-Job adapter and calculation engine are already shared, while consolidating the duplicated UI components can be treated as a later refactoring opportunity.

ChatGPT helped me add the candidate screens, connect them to React state, reuse the existing form-to-Job adapter and calculation engine, and extend the Comparison view so that multiple candidate jobs could be displayed against the current baseline.

During the integration, the TypeScript build identified an incorrect property name in AI-generated code for the job position. I inspected the canonical Job type, confirmed that the actual property was `position` rather than `positionTitle`, corrected the component and rebuilt the application successfully.

I then manually tested the complete flow with multiple jobs. I checked that a fully completed candidate produced Gross Pay, Real Net, total time, effective net income per hour and work-pattern results. I also verified that the displayed Real Net difference matched the candidate result minus the current baseline. An incompletely entered candidate displayed No data where the calculation did not have sufficient source information rather than silently treating missing values as zero.

This stage reinforced the way I used AI throughout the project: AI helped generate and connect code, but I used the type system, builds, the existing data model and manual calculations to understand and verify the result before accepting it.

## Using AI during end-to-end reference verification

After the manual input and candidate comparison flow was working, I used ChatGPT to help plan and investigate a full end-to-end verification against the spreadsheet reference model.

We deliberately did not move directly to predefined demo data. I first cleared the temporary development candidates using the Remove action and manually entered the current situation and all seven reference candidate jobs through the application's normal UI.

I then compared the application outputs with the spreadsheet reference values. Where the first results differed, I used ChatGPT to help trace the discrepancies back through the source inputs and calculation path rather than immediately changing the calculation engine.

This investigation identified differences in the manually entered data for the PKL, XYZ and One Stop scenarios. It also exposed a usability issue: although jobs could be removed and re-entered, there was no convenient way to correct an existing candidate.

I used ChatGPT to help implement an Edit modal that updates the source Job data while preserving the existing calculation architecture. The calculated outputs themselves remain derived values; changing a source input causes the job to be recalculated through the same calculation engine.

I then used the Edit functionality to correct the affected source inputs and repeated the verification. After the corrections, the manually entered current situation and all seven candidate jobs matched the spreadsheet reference outputs at the displayed rounding precision.

This stage was another example of how I used AI as a development and investigation tool rather than as the source of truth. The spreadsheet remained the independent reference, the application data was entered and checked through the user-facing flow, and discrepancies were investigated before code or calculations were changed.

## Using AI to add the reviewer demo path

After completing the manual end-to-end verification, I used ChatGPT to help turn the verified source inputs into a reusable demo dataset.

This was deliberately done after verification rather than before it. The current situation and seven candidate jobs had first been entered through the normal UI, discrepancies had been investigated and corrected, and the resulting outputs had been checked against the spreadsheet reference model.

I temporarily exported the verified application state so that the exact current-situation inputs, home and travel inputs, and seven candidate jobs could be captured without manually reconstructing them. The temporary export code was then removed.

ChatGPT helped me create a typed demo-data module and connect it to the existing React state. I added a Load demo data option to the initial Current Situation screen so that a reviewer can immediately inspect a completed comparison without having to enter all eight scenarios manually.

The demo path does not introduce a separate calculation path. It loads the verified source data into the existing application state and continues to use the same Job model and calculation engine as the normal application flow. The manual input journey remains available and unchanged.
