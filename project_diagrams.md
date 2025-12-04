# PROJECT DIAGRAMS
# ANIMAL SHELTER HELPLINE

This document contains visual diagrams representing the architecture, workflow, and logic of the Animal Shelter Helpline system. These diagrams are written in **Mermaid.js** syntax, which renders as images in most modern markdown viewers (like GitHub, VS Code, Obsidian).

---

## 1. SYSTEM ARCHITECTURE DIAGRAM

This diagram shows the high-level structure of the application, including the client, server, database, and external integrations.

```mermaid
graph TD
    subgraph "Client Side (PWA)"
        Browser[Mobile/Desktop Browser]
        Camera[Camera Module]
        Geo[Geolocation API]
    end

    subgraph "Server Side (Next.js)"
        API[API Routes /api/*]
        Auth[Auth Middleware]
        Prisma[Prisma ORM]
    end

    subgraph "Data Layer"
        DB[(PostgreSQL Database)]
    end

    subgraph "External Services"
        OpenAI[OpenAI GPT-4o API]
        Cloudinary[Cloudinary Media Storage]
        Maps[Leaflet / Map Tiles]
    end

    %% Connections
    Browser -->|HTTPS Request| API
    Browser -->|Capture| Camera
    Browser -->|Get Coords| Geo

    API -->|Validate| Auth
    API -->|Query| Prisma
    Prisma -->|Read/Write| DB

    API -->|Analyze Image| OpenAI
    API -->|Upload Image| Cloudinary
    Browser -->|Render Map| Maps

    classDef box fill:#f9f9f9,stroke:#333,stroke-width:2px;
    class Browser,API,DB,OpenAI box
```

---

## 2. COMPLETE WORKFLOW FLOWCHART

This flowchart illustrates the step-by-step journey of a user reporting an injured animal.

```mermaid
flowchart TD
    Start([User Opens App]) --> Perm{Location Permission?}

    Perm -- No --> RequestPerm[Request Permission]
    RequestPerm --> Perm
    Perm -- Yes --> Camera[Open Camera]

    Camera --> Capture[Capture Photo]
    Capture --> Upload[Upload to Server]

    subgraph "Backend Processing"
        Upload --> AI_Analysis["AI Analysis (GPT-4o)"]
        AI_Analysis -->|Identify Animal| Tag1[Tag Species]
        AI_Analysis -->|Assess Injury| Tag2[Tag Severity]
        AI_Analysis -->|Check Environment| Tag3[Safety Check]
    end

    Tag3 --> Form[Pre-fill Report Form]
    Form --> UserReview[User Reviews Details]
    UserReview --> Submit[Submit Report]

    Submit --> SaveDB[(Save to Database)]
    SaveDB --> Notify[Notify Nearby Shelters]
    Notify --> End([End])

    style Start fill:#90EE90
    style End fill:#FFB6C1
    style AI_Analysis fill:#87CEEB
```

---

## 3. AI PROCESSING SEQUENCE DIAGRAM

This diagram details the specific interaction between the System and the GPT-4o Model.

```mermaid
sequenceDiagram
    participant User
    participant App as Next.js App
    participant Cloud as Cloudinary
    participant AI as OpenAI GPT-4o

    User->>App: Uploads Image
    activate App
    App->>Cloud: Upload Image File
    activate Cloud
    Cloud-->>App: Return Image URL
    deactivate Cloud

    App->>AI: POST /v1/chat/completions
    Note right of App: Payload: { ImageURL, SystemPrompt }
    activate AI

    Note over AI: 1. Process Image Pixels<br/>2. Identify Species<br/>3. Detect Injuries<br/>4. Generate JSON

    AI-->>App: Return JSON Analysis
    deactivate AI

    App->>App: Parse JSON & Update State
    App-->>User: Display Analysis Results
    deactivate App
```

---

## 4. USE CASE DIAGRAM

This diagram identifies the actors and their interactions with the system.

```mermaid
graph LR
    subgraph "Actors"
        User((Public User))
        Admin((Shelter Admin))
        AI((System AI))
    end

    subgraph "Animal Shelter Helpline System"
        UC1[Report Injured Animal]
        UC2[Upload Photo]
        UC3[Share Location]
        UC4[View Nearby Shelters]

        UC5[Analyze Image]
        UC6[Auto-Tag Severity]

        UC7[Manage Reports]
        UC8[Update Rescue Status]
        UC9[View Dashboard]
    end

    %% Relationships
    User --> UC1
    User --> UC4
    UC1 -.->|include| UC2
    UC1 -.->|include| UC3

    UC2 -->|Triggers| AI
    AI --> UC5
    UC5 -.->|include| UC6

    Admin --> UC9
    UC9 -.->|include| UC7
    Admin --> UC8
```

---

## 5. DATABASE ENTITY-RELATIONSHIP (ER) DIAGRAM

This diagram shows the data structure and relationships.

```mermaid
erDiagram
    USER ||--o{ REPORT : submits
    SHELTER ||--o{ REPORT : manages
    REPORT ||--o{ COMMENT : has

    USER {
        string id PK
        string name
        string email
        string role
    }

    REPORT {
        string id PK
        string image_url
        float latitude
        float longitude
        string species
        string injury_severity
        string status
        datetime created_at
    }

    SHELTER {
        string id PK
        string name
        string address
        string contact_number
        boolean is_verified
    }

    COMMENT {
        string id PK
        string content
        datetime created_at
    }
```
