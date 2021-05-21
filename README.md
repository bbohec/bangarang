# Summary
- [Summary.](#summary)
- [What is Bangarang?](#what-is-bangarang)
- [Does Bangarang have a demo?](#does-bangarang-have-a-demo)
- [How to deploy a new Bangarang instance?](#how-to-deploy-a-new-bangarang-instance)
    - [Install Bangarang](#install-bangarang)
    - [Develop Bangarang](#develop-bangarang)
    - [Build Bangarang](#build-bangarang)
    - [Run Bangarang](#run-bangarang)
- [Bangarang development practice.](#bangarang-development-practice)
    - [Bangarang architecture](#bangarang-architecture)
    - [Language](#language)
    - [Testing library](#testing-library)
    - [Business logic change](#business-logic-change)
    - [Technological change](#technological-change)
    - [Production Architecture](#production-architecture)
        - [Front-end details](#front-end-details)
        - [Back-end details](#back-end-details)
- [Project Tree Information](#project-tree-information)

# What is Bangarang?
Bangarang is an open source and free direct democratic claim system. It allows anybody to declare or search for claim and claiming for them.

This project uses an iterative product management approach.
Previous dev sessions are available in French as DevLog on [YouTube](https://youtube.com/playlist?list=PL4jAusJfrmMvdqkbimRpmuUCGdz311dO- "Bangarang DevLog Playlist").

# Does Bangarang have a demo?
The current production instance of Bangarang is available [here](https://bangarang.sometimesuseful.com/ "Bangarang WebApp").

# How to deploy a new Bangarang instance?
Bangarang is actually configured to be deployed continuously on [Vercel](https://vercel.com/ "Vercel Website") with [GitHub](https://github.com/ "GitHub Website") integration. It means when you make changes on GitHub, Vercel will be triggered to redeploy a new instance of Bangarang depending on the branch you have made the change.

Actually, Bangarang have only one persistent database option based on Google Cloud Platform Datastore technology.

In order to configure Bangarang with your own GCP Datastore instance, you must set the following environment variables:
```sh
NODE_ENV=**ENVIRONMENT**
REST_ENDPOINT_FQDN=**NODE INSTANCE FQDN**
REST_ENDPOINT_SHEME=**http or https**
GCP_DATASTORE_PROJECT_ID='{"gcpProjectId":"**YOUR GCP DATASTORE INSTANCE PROJECT ID**"}'
GCP_DATASTORE_CLIENT_EMAIL='{"gcpClientEmail":"**YOUR GCP DATASTORE INSTANCE SERVICE ACCOUNT EMAIL**"}'
GCP_DATASTORE_PRIVATE_KEY='{"gcpPrivateKey":"**YOUR GCP DATASTORE INSTANCE SERVICE ACCOUNT PRIVATE KEY**"}'
GCP_DATASTORE_KIND_PREFIX='{"gcpKindPrefix":"**OPTIONAL GCP KIND PREFIX**"}'
```

> These environment variables can be set through your system and/or with a `.env` file for development purpose.

> Bangarang server will crash during starting if some environment variables are missing.

## Install Bangarang
`npm install`
## Develop Bangarang
Bangarang will be executed in a dev/watch way.

`npm run dev`
## Build Bangarang
The build prepare Bangarang optimized artifacts (reduced Tailwind CSS).

`npm run build`
## Run Bangarang
`npm run start`

# Bangarang development practice
## Bangarang architecture
Bangarang is developed through the following practices/methodologies (we try to 😉):
- Clean Code
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html "Uncle Bob Clean Architecture - Clean Coder") / [Hexagonal Architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software) "Hexagonal Architecture - Wikipedia")
- Business Logic
    - Acceptance Test Driven Development (ATDD) based on Behavior Driven Development feature examples/scenarios.
    - Test Driven Development when obvious implementation is not found.
- Adapters integration.
    - Test After suite created from Fake Adapters
    - Production technology adapters developed from the previous test suite with a test first way.
> In that way, we expect that Bangarang can evolve its technology and/or business logic and/or design in a sustainable development. 

## Language
Bangarang is principally developed with Typescript. But it is also implementing Svelte/Typescript files for front-end components.

## Testing library
Bangarang is using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) testing and assertion libraries.

## Business logic change
Current Bangarang business logic can be tested through the following command:
> `npm run test:acceptance`

Each feature is described by BDD example scenarios that are at the end translated into code test suite by following the following process:
- discuss the feature and imagine working and non-working examples
- write the feature and its examples in a feature text file. Write the feature help people make sure the feature, examples and ubiquitous language are understandable for all. Current features are using a Gherkin or AAA or State/Event/Consequences way of specifying examples
- translate the text example into a code test suite in an iterative way. Each assertion must be done by following the TDD cycles (Red — Green — Refactor)
- while features are not added to the project, it is allowed to experiment refactoring sessions
- features use Clean Architecture design pattern. By default, the feature uses Fake Adapters (in memory). That way, all the business logic can be validated in seconds in order to provide close to instant feedback
- if a part of the business logic doesn't have an obvious implementation, then a specific unit test suite can be applied in a more TDD baby step approach order to absorb the difficulty.
>  217 passing (110ms)

## Technological change
Current Bangarang technologies can be tested through the integration test suite by executing the following command:
> `npm run test:integration`

Each adapter has its own test suite. The test suite is made in a Test After methodology of testing all methods of the Fake Adapter required by the Business Logic contract (Port interface).

Production adapters that have to implement the Port of the Business Logic are created without implementation and are validated in a Test First/TDD way.


## Production Architecture
### Front-end details
- Svelte UI provided by Sapper middleware used on Node.js Express JS back-end server.
- Style components implements Tailwind CSS classes on HTML parts.
- Svelte & Sapper component are built with Rollup configuration.
- The business logic is actually hosted on front-end.
- It is planned to move the critical business logic into the back-end and use instead simple command/query on backend when required.
- Business Logic use cases are executed from the User class.
- The Business Logic interact indirectly with front-end Svelte components by using Svelte Stores (publisher/subscriber svelte components).
- The Business logic interact with persistent databases by sending Rest requests to the back-end.

### Back-end details
- The express server has HTTP/REST routes used by client business logic in order to execute GCP Adapter methods.
- It is planned to define command/query use cases on backend.

# Project Tree Information
```
.
├───.vscode------------------------Specific VS Code
├───doc
│   ├───dev------------------------Technical/Developer Documentation
│   ├───market---------------------Marketing / Product Documentation
│   ├───ui-------------------------User Interface Documentation
│   └───ux-------------------------User Experience Documentation
├───src
│   ├───assets---------------------/!\ Specific Sapper /!\
│   ├───client
│   │   ├───adapters---------------Clean Architecture - Client Adapters (Primary & Secondary)
│   │   ├───businessLogic
│   │   │   ├───entities-----------Clean Architecture - Business Logic/Core - Entities
│   │   │   └───commands-----------Clean Architecture - Business Logic/Core - Use Cases
│   │   ├───components-------------Svelte Components
│   │   ├───interfaces-------------UI/Svelte Specific interfaces excluded from Clean Architecture
│   │   ├───logic------------------UI/Svelte Specific logic excluded from Clean Architecture
│   │   ├───port-------------------Clean Architecture - Ports/Interfaces
│   │   ├───stores-----------------Svelte Stores
│   │   └───views------------------Svelte Specific View Components
│   ├───node_modules---------------/!\ Specific Sapper /!\
│   ├───routes---------------------Sapper Routes
│   └───tests
│       ├───acceptance-------------Business Logic / Core Tests
│       └───integration------------Integration / Adapter Tests
├───static-------------------------Sapper Static Files
└───__sapper__---------------------/!\ Specific Sapper /!\
```

# Features
```gherkin
  Feature: Claiming
    As a Bangarang Member
    In order to claim
    I want to claim on claim

        Scenario: Claiming For
      √ Given the user is signed in
      √ And the claim with id 'claim' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | claim title | 10           | 10                 | 0                     |
      √ When the user claim 'For' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Success' status and 'Claimed.' message.
      √ And the 'peopleClaimed' quantity on claim 'claim title' is 11
      √ And the 'peopleClaimedFor' quantity on claim 'claim title' is 11
      √ And the 'peopleClaimedAgainst' quantity on claim 'claim title' is 0
      √ And the user view is "claim".

        Scenario: Claiming Against
      √ Given the user is signed in
      √ And the claim with id 'claim' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | claim title | 20           | 0                 | 20                     |
      √ When the user claim 'Against' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Success' status and 'Claimed.' message.
      √ And the 'peopleClaimed' quantity on claim 'claim title' is 21
      √ And the 'peopleClaimedFor' quantity on claim 'claim title' is 0
      √ And the 'peopleClaimedAgainst' quantity on claim 'claim title' is 21
      √ And the user view is "claim".

        Scenario: Claim not declared on Bangarang
      √ Given the user is signed in
      √ And there is no declared claims on Bangarang
      √ When the user claim 'Against' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Failed' status and 'The claim 'claim' is not declared on Bangarang.' message.
      √ And the user view is "claim".

        Scenario: User not Signed In
      √ Given the user is not signed in
      √ And the claim with id 'claim' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | claim title | 20           | 0                 | 20                     |
      √ When the user claim 'Against' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Failed' status and 'You must be signed in in order to claim.' message.
      √ And the 'peopleClaimed' quantity on claim 'claim title' is 20
      √ And the 'peopleClaimedFor' quantity on claim 'claim title' is 0
      √ And the 'peopleClaimedAgainst' quantity on claim 'claim title' is 20
      √ And the user view is "SigningInMenu".

        Scenario: Can't claim For multiple times
      √ Given the user is signed in
      √ And the claim with id 'claim' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | claim title | 10           | 10                 | 0                     |
      √ And the user has previously claimed 'For' on claim 'claim title'
      √ When the user claim 'For' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Failed' status and 'Claiming 'For' multiple times on a claim is forbidden.' message.
      √ And the 'peopleClaimed' quantity on claim 'claim title' is 10
      √ And the 'peopleClaimedFor' quantity on claim 'claim title' is 10
      √ And the 'peopleClaimedAgainst' quantity on claim 'claim title' is 0
      √ And the user view is "claim".

        Scenario: Can't claim Against multiple times
      √ Given the user is signed in
      √ And the claim with id 'claim' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | claim title | 10           | 9                 | 1                     |
      √ And the user has previously claimed 'Against' on claim 'claim title'
      √ When the user claim 'Against' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Failed' status and 'Claiming 'Against' multiple times on a claim is forbidden.' message.
      √ And the 'peopleClaimed' quantity on claim 'claim title' is 10
      √ And the 'peopleClaimedFor' quantity on claim 'claim title' is 9
      √ And the 'peopleClaimedAgainst' quantity on claim 'claim title' is 1
      √ And the user view is "claim".

        Scenario: user change claim choice For > Against
      √ Given the user is signed in
      √ And the claim with id 'claim' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | claim title | 10           | 10                 | 0                     |
      √ And the user has previously claimed 'For' on claim 'claim title'
      √ When the user claim 'Against' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Success' status and 'Claimed.' message.
      √ And the 'peopleClaimed' quantity on claim 'claim title' is 10
      √ And the 'peopleClaimedFor' quantity on claim 'claim title' is 9
      √ And the 'peopleClaimedAgainst' quantity on claim 'claim title' is 1
      √ And the user view is "claim".

        Scenario: user change claim choice Against > For
      √ Given the user is signed in
      √ And the claim with id 'claim' is declared on Bangarang with the following values:
                | claim title |claimed people| claimed For people | claimed Against people|
                | claim title | 10           | 0                 | 10                     |
      √ And the user has previously claimed 'Against' on claim 'claim title'
      √ When the user claim 'For' on the claim with title 'claim title'
      √ Then the user has a 'Claiming.' notification with 'Success' status and 'Claimed.' message.
      √ And the 'peopleClaimed' quantity on claim 'claim title' is 10
      √ And the 'peopleClaimedFor' quantity on claim 'claim title' is 1
      √ And the 'peopleClaimedAgainst' quantity on claim 'claim title' is 9
      √ And the user view is "claim".

  Feature: Declaring Claim
    As a guest or a Bangarang Member
    In order to claim or share a claim
    I want to declare a claim

    Scenario: Declaring Simple Claim
      √ Given the user current view is the "declaring claim menu"
      √ And the claim with id 'claimId' is not declared on Bangarang.
      √ When the user declare a new 'Simple' claim with title 'expectedClaim'.
      √ Then the claim with title 'expectedClaim' is declared on Bangarang.
      √ And the user has a 'Declaring claim.' notification with 'Success' status and 'Declared.' message.
      √ And the user current view is the "claimId"

    Scenario: Claim with same title already exist
      √ Given the user current view is the "declaring claim menu"
      √ And the claim with id 'claimId' and title 'expectedClaim' is declared on Bangarang.
      √ When the user declare a new 'Simple' claim with title 'expectedClaim'.
      √ Then the new claim is not declared on Bangarang.
      √ And the user has a 'Declaring claim.' notification with 'Failed' status and 'The claim "expectedClaim" already exist.' message.
      √ And the user current view is the "claimId"

    Scenario: Claim with same title uppercase already exist
      √ Given the user current view is the "declaring claim menu"
      √ And the claim with id 'claimId' is declared on Bangarang.
      √ When the user declare a new 'Simple' claim with title 'EXPECTEDCLAIM'.
      √ Then the new claim is not declared on Bangarang.
      √ And the user has a 'Declaring claim.' notification with 'Failed' status and 'The claim "EXPECTEDCLAIM" already exist.' message.
      √ And the user current view is the "claimId"

    Scenario: Claim with empty title
      √ Given the user current view is the "declaring claim menu"
      √ When the user declare a new 'Simple' claim with title ''.
      √ Then the new claim is not declared on Bangarang.
      √ And the user has a 'Declaring claim.' notification with 'Failed' status and 'A claim must have a title.' message.
      √ And the user current view is the "declaring claim menu"

  Feature: Registering
    As a guest,
    In order to claim,
    I want to register on Bangarang.

    Scenario: Register on Bangarang.
      √ Given the user is not signed in as 'johndoe'.
      √ And there is no 'johndoe' Bangarang member'
      √ When the user register on Bangarang with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   |  john@doe.com | John Doe  |
      √ Then 'johndoe' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   |  john@doe.com | John Doe  |
      √ And the user has a 'Registering.' notification with 'Success' status and 'Registered.' message.

    Scenario: Invalid email.
      √ Given the user is not signed in as 'johndoe'.
      √ And there is no 'johndoe' Bangarang member'
      √ When the user register on Bangarang with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   |  johndoe.com | John Doe  |
      √ And there is no 'johndoe' Bangarang member'
      √ And the user has a 'Registering.' notification with 'Failed' status and 'Email invalid.' message.

    Scenario: Invalid email 2.
      √ Given the user is not signed in as 'johndoe'.
      √ And there is no 'johndoe' Bangarang member'
      √ When the user register on Bangarang with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   |  john@doe. | John Doe  |
      √ And there is no 'johndoe' Bangarang member'
      √ And the user has a 'Registering.' notification with 'Failed' status and 'Email invalid.' message.

    Scenario: Unsecure Password.
      √ Given the user is not signed in as 'johndoe'.
      √ And there is no 'johndoe' Bangarang member'
      √ When the user register on Bangarang with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | password   |  john@doe.com | John Doe  |
      √ And there is no 'johndoe' Bangarang member'
      √ And the user has a 'Registering.' notification with 'Failed' status and 'Unsecure password.' message.
    
    Scenario: Already member of Bangarang.
      √ Given the user is not signed in as 'johndoe'.
      √ And 'johndoe' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   |  john@doe.com | John Doe  |
      √ When the user register on Bangarang with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVsdfsdfdFrr4jF'Rx7   |  johnny@doe.com | Johnny Doe  |
      √ Then 'johndoe' is a Bangarang member with the following parameters:
            | username | password           | email         | fullname  |
            | johndoe  | "(VRVdFrr4jF'Rx7   |  john@doe.com | John Doe  |
      √ And the user has a 'Registering.' notification with 'Failed' status and 'Already member of Bangarang.' message.

  Feature : Retrieving Claim
    As a guest or a Bangarang Member
    In order to share a claim or to claim
    I want to retrieve a claim

    Scenario: Retrieve Claim as Guest
      √ Given the user is signed in
      √ And the claim 'Claim Title' with id 'claimId' is declared on Bangarang
      √ When the user retrieve the claim with title 'Claim Title'
      √ Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | Claim Title | 10                |   9                   |   1                       |    undefined                    |
      √ And the user has a 'Retrieving claim.' notification with 'Success' status and 'Claim retrieved.' message.

    Scenario: Retrieve Claim as Bangarang member that has not claimed yet
      √ Given the user is signed in
      √ And the user has not claimed on claim 'Claim Title'
      √ And the claim 'Claim Title' is declared on Bangarang
      √ When the user retrieve the claim with id 'claimId'
      √ Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | Claim Title | 10                |   9                   |   1                       |    undefined                    |
      √ And the user has a 'Retrieving claim.' notification with 'Success' status and 'Claim retrieved.' message.

    Scenario: Retrieve Claim as Bangarang member that has claimed For
      √ Given the user is signed in
      √ And the user has claimed 'For' on claim 'Claim Title'
      √ And the claim 'Claim Title' is declared on Bangarang
      √ When the user retrieve the claim with id 'claimId'
      √ Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | Claim Title | 10                |   9                   |   1                       |    For                    |
      √ And the user has a 'Retrieving claim.' notification with 'Success' status and 'Claim retrieved.' message.

    Scenario: Retrieve Claim as Bangarang member that has claimed Against
      √ Given the user is signed in
      √ And the user has claimed 'Against' on claim 'Claim Title'
      √ And the claim 'Claim Title' is declared on Bangarang
      √ When the user retrieve the claim with id 'claimId'
      √ Then the retrieved claim in the claim user notification has the following information: 
        | title | people claimed    | people claimed for    | people claimed against    | previous user claim choice    |
        | Claim Title | 10                |   9                   |   1                       |    Against                    |
      √ And the user has a 'Retrieving claim.' notification with 'Success' status and 'Claim retrieved.' message.

    Scenario: Claim not found
      √ Given the user is signed in
      √ And the claim 'Claim Title' is not declared on Bangarang
      √ When the user retrieve the claim with title 'claimId'
      √ Then the retrieved claim is undefined
      √ And the user has a 'Retrieving claim.' notification with 'Failed' status and 'The claim is not declared on Bangarang.' message.

  Feature: Searching Claims
    As a guest or a Bangarang Member,
    In order to claim or share a claim,
    I want to find claims

        Scenario 1: order engine unit 1
      √ Given there is the following declared claims:
                [good people,good people1,good people 2,good 3 people,PEOPLE GOOD]
      √ When the user search claims with search criteria 'good people'
      √ Then the retreived claims is the following:
                [good people,good people 2,PEOPLE GOOD,good 3 people,good people1]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '5 claims found.' message.

        Scenario 2: order engine unit 2
      √ Given there is the following declared claims:
                [good 4 people,PEOPLE GOOD]
      √ When the user search claims with search criteria 'good people'
      √ Then the retreived claims is the following:
                [PEOPLE GOOD,good 4 people]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 3: order engine unit 3
      √ Given there is the following declared claims:
                [good NOPE people,PEOPLE GOOD]
      √ When the user search claims with search criteria 'good people'
      √ Then the retreived claims is the following:
                [PEOPLE GOOD,good NOPE people]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 4: order engine unit 4
      √ Given there is the following declared claims:
                [Bad NOPE Cookie,COOKIE BAD]
      √ When the user search claims with search criteria 'Bad Cookie'
      √ Then the retreived claims is the following:
                [COOKIE BAD,Bad NOPE Cookie]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 5: order engine unit 5
      √ Given there is the following declared claims:
                [Third NOPE Thing,THING THIRD]
      √ When the user search claims with search criteria 'Thing Third'
      √ Then the retreived claims is the following:
                [THING THIRD,Third NOPE Thing]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 6: order engine unit 6
      √ Given there is the following declared claims:
                [good 3 people,GOOD 4 PEOPLE]
      √ When the user search claims with search criteria 'good people'
      √ Then the retreived claims is the following:
                [good 3 people,GOOD 4 PEOPLE]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 7: order engine unit 7
      √ Given there is the following declared claims:
                [third NOPE thing,THIRD LOREM THING]
      √ When the user search claims with search criteria 'third thing'
      √ Then the retreived claims is the following:
                [third NOPE thing,THIRD LOREM THING]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 8: order engine unit 8
      √ Given there is the following declared claims:
                [third 3 thing,THIRD 4 THING]
      √ When the user search claims with search criteria 'third thing'
      √ Then the retreived claims is the following:
                [third 3 thing,THIRD 4 THING]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 9: order engine unit 9
      √ Given there is the following declared claims:
                [third thing,THIRD THING]
      √ When the user search claims with search criteria 'THIRD THING'
      √ Then the retreived claims is the following:
                [third thing,THIRD THING]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '2 claims found.' message.

        Scenario 10: Searching Claims with one word
      √ Given there is the following declared claims:
                [claim,claim2,claim3,Claim4,CLAIME5,Cloum]
      √ When the user search claims with search criteria 'claim'
      √ Then the retreived claims is the following:
                [claim,claim2,claim3,Claim4,CLAIME5]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '5 claims found.' message.

        Scenario 11: Searching Claims with multiple words
      √ Given there is the following declared claims:
                [good people,good people1,good people 2,good 3 people,GOOD 4 PEOPLE,PEOPLE GOOD,Cloum]
      √ When the user search claims with search criteria 'good people'
      √ Then the retreived claims is the following:
                [good people,good people 2,PEOPLE GOOD,good 3 people,GOOD 4 PEOPLE,good people1]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '6 claims found.' message.

        Scenario 12: Searching Claims with one or multiple words
      √ Given there is the following declared claims:
                [good,people,good people,good 2 people,GOOD 4 PEOPLE,PEOPLE GOOD,Cloum]
      √ When the user search claims with search criteria 'good people'
      √ Then the retreived claims is the following:
                [good people,PEOPLE GOOD,good 2 people,GOOD 4 PEOPLE,good,people]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '6 claims found.' message.

        Scenario 13: No claims match search criteria
      √ Given there is the following declared claims:
                [cloum,cloum2,cloum3,Cloum4,CLOUME5]
      √ When the user search claims with search criteria 'claim'
      √ Then the retreived claims is the following:
                []
      √ And the user has a 'Searching Claims' notification with 'Success' status and '0 claims found.' message.

        Scenario 14: Claims found with bad lower/upper case search criteria
      √ Given there is the following declared claims:
                [cloum2,cloum3,Cloum4,CLOUME5,cloum]
      √ When the user search claims with search criteria 'clOUm'
      √ Then the retreived claims is the following:
                [cloum,cloum2,cloum3,Cloum4,CLOUME5]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '5 claims found.' message.

        Scenario 15: Claim with punctuation & search criteria without punctuation
      √ Given there is the following declared claims:
                [Guillermo Lasso est-il le président de l'Equateur?]
      √ When the user search claims with search criteria 'equateur'
      √ Then the retreived claims is the following:
                [Guillermo Lasso est-il le président de l'Equateur?]
      √ And the user has a 'Searching Claims' notification with 'Success' status and '1 claims found.' message.


Feature: Signing In
    As a guest
    In order to claim
    I want to sign in Bangarang

    Scenario: User Signing In
      √ Given the user is not signed in
      √ And there is 'johndoe' Bangarang member with password 'Password'
      √ When the user signin as 'johndoe' with password 'Password'
      √ Then the user is signed in as a Bangarang member with the following information:
            | username | user fullname |
            | johndoe  |       |
      √ And the user has a 'Signing In' notification with 'Success' status and 'Signed In.' message.

    Scenario: User already signed in
      √ Given the user is already SignedIn
      √ When the user signin as 'johndoe' with password 'Password'
      √ Then the user has a 'Signing In' notification with 'Failed' status and 'Already signed in.' message.

    Scenario: User is not a Bangarang member
      √ Given the user is not signed in
      √ And there is no 'johndoe' Bangarang member'
      √ When the user signin as 'johndoe' with password 'Password'
      √ Then the user has a 'Signing In' notification with 'Failed' status and 'Bad credentials. Verify credentials or register to Bangarang.' message.

    Scenario: Bad credentials
      √ Given the user is not signed in
      √ And there is 'johndoe' Bangarang member with password 'Password'
      √ When the user signin as 'johndoe' with password 'baspassword'
      √ Then the user has a 'Signing In' notification with 'Failed' status and 'Bad credentials. Verify credentials or register to Bangarang.' message.


  217 passing (113ms)
```

# Technical Integration
```gherkin
  Bangarang Claim Interactor - Integration Test
    
    Integration Test with 'fake' adapter.
      √ claimById - error
      √ claimByTitleIncencitiveCase - error
      √ isClaimExistByTitleIncensitiveCase - error
      √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - error
      √ saveClaim - error
      save claim scenario
        √ isClaimExistByTitleIncensitiveCase - The claim 'Claim with impoRtant stuff on It.' don't exist.
        √ saveClaim - The claim 'Claim with impoRtant stuff on It.' is saved.
        √ isClaimExistByTitleIncensitiveCase - The claim 'Claim with impoRtant stuff on It.' exist.
        √ claimById - The claim 'Claim with impoRtant stuff on It.' can be retrieved by Id.        √ claimByTitleIncencitiveCase - The claim 'Claim with impoRtant stuff on It.' can be retrieved by it's title.
        √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - The claim 'Claim with impoRtant stuff on It.' is retrieved with 'imporTant dog toto important' search criteria.
        √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - No claim is retrieved with 'dog' search criteria.
    
    Integration Test with 'restFake' adapter.
      √ claimById - error
      √ claimByTitleIncencitiveCase - error
      √ isClaimExistByTitleIncensitiveCase - error
      √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - error
      √ saveClaim - error
      save claim scenario
        √ isClaimExistByTitleIncensitiveCase - The claim 'Claim with impoRtant stuff on It.' don't exist.
        √ saveClaim - The claim 'Claim with impoRtant stuff on It.' is saved.
        √ isClaimExistByTitleIncensitiveCase - The claim 'Claim with impoRtant stuff on It.' exist.
        √ claimById - The claim 'Claim with impoRtant stuff on It.' can be retrieved by Id.        √ claimByTitleIncencitiveCase - The claim 'Claim with impoRtant stuff on It.' can be retrieved by it's title.
        √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - The claim 'Claim with impoRtant stuff on It.' is retrieved with 'imporTant dog toto important' search criteria.
        √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - No claim is retrieved with 'dog' search criteria.
    
    Integration Test with 'restGcp' adapter.
      √ claimById - error (46ms)
      √ claimByTitleIncencitiveCase - error (96ms)
      √ isClaimExistByTitleIncensitiveCase - error
      √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - error
      √ saveClaim - error
      save claim scenario
        √ isClaimExistByTitleIncensitiveCase - The claim 'Claim with impoRtant stuff on It.' don't exist. (53ms)
        √ saveClaim - The claim 'Claim with impoRtant stuff on It.' is saved. (69ms)
        √ isClaimExistByTitleIncensitiveCase - The claim 'Claim with impoRtant stuff on It.' exist. (72ms)
        √ claimById - The claim 'Claim with impoRtant stuff on It.' can be retrieved by Id. (50ms)
        √ claimByTitleIncencitiveCase - The claim 'Claim with impoRtant stuff on It.' can be retrieved by it's title. (67ms)
        √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - The claim 'Claim with impoRtant stuff on It.' is retrieved with 'imporTant dog toto important' search criteria. (76ms)
        √ retrieveClaimsThatContainInIncensitiveCaseTitleOneOrMoreIncencitiveCaseSearchCriteriaWords - No claim is retrieved with 'dog' search criteria.


  Bangarang Member Interactor - Integration Test
    
    Integration Test with 'fake' adapter.
      √ retrievePreviousMemberClaimChoiceOnClaim - error
      √ retrievePreviousMemberClaimChoiceOnClaim & saveMemberClaim - testclaimId - OK      
      √ saveMember - error - Member not saved
      √ isMemberExistWithUsername & saveMember - OK - Member 'test' saved and exist
      √ saveCredentials - OK - Credentials saved
      √ saveCredentials - error - Credentials not saved
      √ isCredentialsValid - OK - isCredentialsValid with bad password
      √ isCredentialsValid - OK - isCredentialsValid with unexisting credentials
      √ isCredentialsValid - OK - isCredentialsValid with good credentials
      √ retrieveUserContract - Error
      √ retrieveUserContract - OK - UserExist
      √ retrieveUserContract - OK - User don't exist
    
    Integration Test with 'RESTfake' adapter.
      √ retrievePreviousMemberClaimChoiceOnClaim - error
      √ retrievePreviousMemberClaimChoiceOnClaim & saveMemberClaim - testclaimId - OK      
      √ saveMember - error - Member not saved
      √ isMemberExistWithUsername & saveMember - OK - Member 'test' saved and exist
      √ saveCredentials - OK - Credentials saved
      √ saveCredentials - error - Credentials not saved
      √ isCredentialsValid - OK - isCredentialsValid with bad password
      √ isCredentialsValid - OK - isCredentialsValid with unexisting credentials
      √ isCredentialsValid - OK - isCredentialsValid with good credentials
      √ retrieveUserContract - Error
      √ retrieveUserContract - OK - UserExist
      √ retrieveUserContract - OK - User don't exist
    
    Integration Test with 'RESTGCPDatastore' adapter.
      √ retrievePreviousMemberClaimChoiceOnClaim - error (40ms)
      √ retrievePreviousMemberClaimChoiceOnClaim & saveMemberClaim - testclaimId - OK (126ms)
      √ saveMember - error - Member not saved
      √ isMemberExistWithUsername & saveMember - OK - Member 'test' saved and exist (113ms)      √ saveCredentials - OK - Credentials saved (63ms)
      √ saveCredentials - error - Credentials not saved
      √ isCredentialsValid - OK - isCredentialsValid with bad password
      √ isCredentialsValid - OK - isCredentialsValid with unexisting credentials
      √ isCredentialsValid - OK - isCredentialsValid with good credentials
      √ retrieveUserContract - Error
      √ retrieveUserContract - OK - UserExist
      √ retrieveUserContract - OK - User don't exist


  72 passing (2s)
```