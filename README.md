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

> Those environment variables can be set through your system and/or with a .env file for development purpose.

> Bangarang server will crash during starting if some environment variables are missing.

## Install Bangarang
> `npm install`
## Develop Bangarang
Bangarang will be executed on a dev/watch way.
> `npm run dev`
## Build Bangarang
The build prepare Bangarang optimized artifacts (reduced Tailwind CSS).
> `npm run build`
## Run Bangarang
> `npm run start`



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
Bangarang is principally developed with Typescript. But it is also implementing Svelte/Typescript files for frontend components.

## Testing library
Bangarang is using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) testing and assertion libraries.

## Work on business logic
Current Bangarang business logic can be tested through the following command:
> `npm run test:acceptance`

Each feature is described by BDD example scenarios that are at the end translated into code test suite by following the following process:
- discuss the feature and imagine working and non-working examples
- write the feature and its examples in a feature text file. Write the feature help people to make sure the feature, examples and ubiquitous language are understandable for all. Current features are using a Gherkin or AAA or State/Event/Consequences way of specifying examples
- translate the text example into a code test suite in an iterative way. Each assertion must be done by following the TDD cycles (Red — Green — Refactor)
- while features are not added to the project, it is allowed to experiment refactoring sessions
- features use clean architecture design. By default, the feature uses Fake Adapters (in memory). That way, all the business logic can be validated in seconds in order to provide close to instant feedback
- if a part of the business logic don't have easy obvious implementation then specific unit test suite can be applied in a more TDD baby step approach order to absorb the difficulty.
>  217 passing (110ms)

## Work on technology
Current Bangarang technologies can be tested through the integration test suite by executing the following command:
> `npm run test:integration`

Each adapter has its own test suite. The test suite is made in a test after way by testing all methods of the Fake Adapter required by the Business Logic contract (Port interface).

Production adapters that have to implement the Port of the Business Logic are created without implementation and are validated in a Test First/TDD way.


## Production Architecture
### Frontend details
- Svelte UI provided by Sapper middleware used on Node.js Express JS backend server.
- Style components are using Tailwind CSS.
- Svelte & Sapper component are build with Rollup configuration.
- The business logic is actually hosted on frontend.
- It is planned to move critical business logic into backend and use instead simple command/query on backend when required.
- Business Logic use cases are executed from the User class.
- The Business Logic interact indirectly with frontend Svelte components by using Svelte Stores (publisher/subscriber svelte components).
- The Business logic interact with persistent databases by sending Rest requests to the backend.

### Backend details
- The express server have Rest routes used by client business logic in order to execute GCP Adapter methods.
- It is planned to defined command/query use cases on backend.