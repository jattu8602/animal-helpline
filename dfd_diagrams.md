# DATA FLOW DIAGRAMS (DFD)
# ANIMAL SHELTER HELPLINE

This document contains the Data Flow Diagrams (DFD) for the Animal Shelter Helpline system, ranging from the high-level context (Level 0) to detailed process breakdowns (Level 2).

---

## LEVEL 0 DFD (CONTEXT DIAGRAM)

The Context Diagram represents the entire system as a single process interacting with external entities.

```mermaid
graph TD
    %% Entities
    User[("User / Reporter")]
    Shelter[("Shelter / Rescuer")]
    Admin[("System Admin")]

    %% Main System
    System((("Animal Shelter<br/>Helpline System")))

    %% Flows
    User -->|1. Submit Report (Image, Loc)| System
    System -->|2. First Aid Advice| User

    System -->|3. Emergency Notification| Shelter
    Shelter -->|4. Update Rescue Status| System

    Admin -->|5. Manage Shelters| System
    System -->|6. Analytics Dashboard| Admin

    %% Styling
    style System fill:#ff9900,stroke:#333,stroke-width:4px,color:white
    style User fill:#00ccff,stroke:#333,stroke-width:2px
    style Shelter fill:#00ccff,stroke:#333,stroke-width:2px
    style Admin fill:#00ccff,stroke:#333,stroke-width:2px
```

---

## LEVEL 1 DFD (SYSTEM OVERVIEW)

This diagram breaks down the main system into its major sub-processes and data stores.

```mermaid
graph LR
    %% Entities
    User[("User")]
    Shelter[("Shelter")]

    %% Processes
    P1(("1.0<br/>Report<br/>Processing"))
    P2(("2.0<br/>AI<br/>Analysis"))
    P3(("3.0<br/>Shelter<br/>Mgmt"))
    P4(("4.0<br/>Notification<br/>Service"))

    %% Data Stores
    D1[("D1: Reports DB")]
    D2[("D2: Users DB")]
    D3[("D3: Shelters DB")]

    %% Flows
    User -->|Submit Data| P1
    P1 -->|Image Data| P2
    P2 -->|Injury Score| P1
    P1 -->|Save Report| D1

    P3 -->|Fetch Nearby| D3
    D3 -->|Shelter Info| P3
    P3 -->|Assign Shelter| D1

    D1 -->|New Incident| P4
    P4 -->|Alert| Shelter
    Shelter -->|Update Status| P3
    P3 -->|Update Status| D1

    %% Styling
    classDef process fill:#ffcc00,stroke:#333,stroke-width:2px;
    classDef store fill:#99ff99,stroke:#333,stroke-width:2px;
    classDef entity fill:#00ccff,stroke:#333,stroke-width:2px;

    class P1,P2,P3,P4 process
    class D1,D2,D3 store
    class User,Shelter entity
```

---

## LEVEL 2 DFD (DETAILED REPORT PROCESSING)

This diagram expands **Process 1.0 (Report Processing)** to show the detailed steps involved in handling a user report.

```mermaid
graph TD
    %% External
    User[("User")]
    AI_Service[("AI Service")]

    %% Sub-Processes
    P1_1(("1.1<br/>Capture<br/>Image"))
    P1_2(("1.2<br/>Validate<br/>Location"))
    P1_3(("1.3<br/>Upload<br/>Media"))
    P1_4(("1.4<br/>Generate<br/>Triage"))
    P1_5(("1.5<br/>Store<br/>Record"))

    %% Data Stores
    D1[("D1: Reports")]
    D4[("D4: Media Storage")]

    %% Flows
    User -->|Photo Input| P1_1
    P1_1 -->|Raw Image| P1_3
    P1_3 -->|Image File| D4
    D4 -->|Image URL| P1_3

    User -->|GPS Data| P1_2
    P1_2 -->|Valid Coords| P1_5

    P1_3 -->|Image URL| P1_4
    P1_4 -->|Request Analysis| AI_Service
    AI_Service -->|JSON Result| P1_4

    P1_4 -->|Triage Data| P1_5
    P1_5 -->|Complete Record| D1

    %% Styling
    classDef subproc fill:#ff99cc,stroke:#333,stroke-width:2px;
    classDef store fill:#99ff99,stroke:#333,stroke-width:2px;
    classDef ext fill:#cccccc,stroke:#333,stroke-width:2px;

    class P1_1,P1_2,P1_3,P1_4,P1_5 subproc
    class D1,D4 store
    class User,AI_Service ext
```
