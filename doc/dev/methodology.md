## Dev Methodology (ATDD + Clean Architecture)
- Core — ATDD — Acceptance Test Driven Development
- Primary Adapter
    - Components
    - Views
    - Events > Core
- Secondary Adapters

User >> FrontEnd Tech >> Primary Adapter (UI) >> Core (UI) >> Secondary Adapter (UI) >> Client/Server Tech >> Primary Adapter (Server) >> Core (Server) >> Secondary Adapter (Server) >> Backend Tech

## DevOps (Engine)
- Metrics
    - Business
    - Tech
- Source Code Repository
- Continuous Integration (Automatic Validation - Business + Tech)
    - Acceptance Tests
    - Integration Tests
    - e2e (End-To-End)
- Continuous Deployment (Build + Run/Update + Script infra)