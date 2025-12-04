# DATA FLOW DIAGRAMS (DFD)
# ANIMAL SHELTER HELPLINE

This document contains the Data Flow Diagrams (DFD) for the Animal Shelter Helpline system, ranging from the high-level context (Level 0) to detailed process breakdowns (Level 2).

---

## LEVEL 0 DFD (CONTEXT DIAGRAM)

The Context Diagram represents the entire system as a single process interacting with external entities.

```mermaid
graph LR
    %% Nodes
    User["User<br/>(Raw Image, Location)"]

    Process((Process 0:<br/>Animal Injury<br/>Detection<br/>System))

    subgraph DB_Block [Databases]
        direction TB
        D1[("D1: Reports/<br/>Injury Data")]
        D2[("D2: Shelter/<br/>First-Aid Data")]
    end

    Admin["Admin<br/>(Manage Reports,<br/>Updates)"]

    %% Flows
    User --> Process
    Process --> DB_Block
    DB_Block --> Admin

    %% Styling
    style Process fill:#FFD700,stroke:#333,stroke-width:3px,color:black
    style User fill:#87CEEB,stroke:#333,stroke-width:2px,color:black
    style Admin fill:#87CEEB,stroke:#333,stroke-width:2px,color:black
    style DB_Block fill:#90EE90,stroke:#333,stroke-width:2px,color:black
    style D1 fill:#ffffff,stroke:#333,stroke-width:1px,color:black
    style D2 fill:#ffffff,stroke:#333,stroke-width:1px,color:black
```

---

## LEVEL 1 DFD (SYSTEM OVERVIEW)

This diagram breaks down the main system into its major sub-processes and data stores.

```mermaid
graph LR
    %% Nodes
    User[User]

    P1[("P1: Image<br/>Processing<br/>& Prep")]
    P2[("P2: Deep<br/>Learning<br/>Inference")]
    P3[("P3: Urgency<br/>Prediction")]
    P4[("P4: Shelter<br/>Retrieval")]
    P5[("P5: Result<br/>Generation")]

    Ext[External<br/>Entity]

    Output[Comprehensive<br/>Output]

    %% Data Stores
    D1[("D1: Reports DB")]
    D2[("D2: Shelters DB")]

    %% Flows
    User -->|"Raw Image"| P1

    P1 -->|"Preprocessed Image"| P2
    P1 -->|"Animal Type"| P4

    Ext --> P4

    P2 -->|"Injury Score"| P3
    P2 -->|"Heatmap Data"| P4

    P3 -->|"Urgency Level"| P5
    P4 -->|"Shelter Info"| P5

    P5 --> Output

    %% Database Interactions
    P3 -.-> D1
    P4 -.-> D2
    D1 -.-> P5
    D2 -.-> P5

    %% Styling
    classDef process fill:#FFD700,stroke:#333,stroke-width:2px,color:black;
    classDef store fill:#90EE90,stroke:#333,stroke-width:2px,color:black;
    classDef entity fill:#87CEEB,stroke:#333,stroke-width:2px,color:black;
    classDef output fill:#FFB6C1,stroke:#333,stroke-width:2px,color:black;

    class P1,P2,P3,P4,P5 process
    class D1,D2 store
    class User,Ext entity
    class Output output
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
    P1_1(("1.1 Capture<br/>Image"))
    P1_2(("1.2 Validate<br/>Location"))
    P1_3(("1.3 Upload<br/>Media"))
    P1_4(("1.4 Generate<br/>Triage"))
    P1_5(("1.5 Store<br/>Record"))

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
    %% Styling
    classDef subproc fill:#FFB6C1,stroke:#333,stroke-width:2px,color:black;
    classDef store fill:#90EE90,stroke:#333,stroke-width:2px,color:black;
    classDef ext fill:#D3D3D3,stroke:#333,stroke-width:2px,color:black;

    class P1_1,P1_2,P1_3,P1_4,P1_5 subproc
    class D1,D4 store
    class User,AI_Service ext
```
