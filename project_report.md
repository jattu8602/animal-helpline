# A MINOR PROJECT REPORT ON
# ANIMAL SHELTER HELPLINE

**Submitted in partial fulfillment of the requirements for the award of the degree of**

**BACHELOR OF TECHNOLOGY**
*(Computer Science & Engineering)*

---

## TABLE OF CONTENTS

1.  **CHAPTER 1: INTRODUCTION**
    *   1.1 Introduction
    *   1.2 Background
    *   1.3 Problem Statement
    *   1.4 Objectives
    *   1.5 Scope of the Project
    *   1.6 Methodology Overview

2.  **CHAPTER 2: SYSTEM ANALYSIS**
    *   2.1 Existing System
    *   2.2 Proposed System
    *   2.3 Feasibility Study
        *   2.3.1 Technical Feasibility
        *   2.3.2 Operational Feasibility
        *   2.3.3 Economic Feasibility
    *   2.4 Requirement Analysis
        *   2.4.1 Functional Requirements
        *   2.4.2 Non-Functional Requirements

3.  **CHAPTER 3: SYSTEM DESIGN**
    *   3.1 System Architecture
    *   3.2 Data Flow Diagram (DFD) Description
    *   3.3 Database Design (ER Model Description)
    *   3.4 User Interface Design

4.  **CHAPTER 4: AI METHODOLOGY & ALGORITHMS**
    *   4.1 Introduction to AI in Triage
    *   4.2 Model Architecture: GPT-4o (Omni)
    *   4.3 Image Processing Pipeline
    *   4.4 Prompt Engineering Strategy
    *   4.5 Zero-Shot Learning & Capabilities

5.  **CHAPTER 5: TECHNOLOGY STACK**
    *   5.1 Frontend Technologies (Next.js, React, Tailwind)
    *   5.2 Backend Technologies (Node.js, Prisma)
    *   5.3 Database (PostgreSQL)
    *   5.4 Third-Party APIs (OpenAI, Cloudinary, Leaflet)

6.  **CHAPTER 6: IMPLEMENTATION & TESTING**
    *   6.1 Module Description
    *   6.2 Testing Strategies
        *   6.2.1 Unit Testing
        *   6.2.2 Integration Testing
        *   6.2.3 User Acceptance Testing (UAT)

7.  **CHAPTER 7: CONCLUSION & FUTURE SCOPE**
    *   7.1 Conclusion
    *   7.2 Limitations
    *   7.3 Future Scope

8.  **REFERENCES**

---

## CHAPTER 1: INTRODUCTION

### 1.1 Introduction
In the contemporary urban landscape, the coexistence of humans and animals often leads to conflicts and accidents. Stray animals, in particular, are vulnerable to injuries from traffic, abuse, and natural causes. The "Animal Shelter Helpline" is a web-based application designed to address the critical need for a rapid, efficient, and technologically advanced response system for animal emergencies. It leverages the power of modern web technologies and Artificial Intelligence to connect compassionate citizens with animal welfare organizations.

### 1.2 Background
Traditionally, reporting an injured animal involves finding a helpline number, making a call, describing the location verbally, and hoping for a response. This process is fraught with inefficiencies: phone lines may be busy, location descriptions may be inaccurate, and the severity of the injury is often communicated poorly. This results in delayed rescues or the deployment of incorrect resources (e.g., sending a small van for a large cow).

### 1.3 Problem Statement
The existing manual systems for animal rescue suffer from:
*   **Latency**: High time lag between spotting an animal and the arrival of help.
*   **Information Asymmetry**: Rescuers lack visual confirmation of the injury before arrival.
*   **Location Inaccuracy**: Verbal descriptions of locations ("near the big tree") are often imprecise.
*   **Resource Mismanagement**: Critical cases are often deprioritized due to a lack of triage data.

### 1.4 Objectives
The primary objectives of this project are:
1.  To develop a **Progressive Web Application (PWA)** that works seamlessly across mobile and desktop devices.
2.  To integrate **Artificial Intelligence (GPT-4o)** for automated image analysis to identify animal species and assess injury severity.
3.  To utilize **Geolocation APIs** to pinpoint the exact location of the incident.
4.  To create a centralized, searchable **directory of shelters** and foster care providers.
5.  To provide a **dashboard** for shelters to manage incoming reports and update rescue statuses.

### 1.5 Scope of the Project
The scope includes the development of a client-side interface for public users to report incidents and a shelter-side interface for managing them. The system covers the entire lifecycle of a rescue operation: from the initial report -> AI triage -> Shelter notification -> Rescue -> Treatment.

### 1.6 Methodology Overview
The project follows the **Agile Software Development** methodology. This allows for iterative development, continuous feedback, and the flexibility to incorporate advanced features like AI integration as the project evolves.

---

## CHAPTER 2: SYSTEM ANALYSIS

### 2.1 Existing System
The current system relies heavily on manual intervention. Users must search for contact numbers, often finding outdated information. Communication is primarily voice-based, leading to errors in data transmission. There is no centralized database to track the status of reported animals.

### 2.2 Proposed System
The proposed "Animal Shelter Helpline" automates the reporting process.
*   **Digital Reporting**: Users fill a simple digital form.
*   **Visual Evidence**: Photos are mandatory and analyzed by AI.
*   **Auto-Location**: GPS coordinates are captured automatically.
*   **Centralized Data**: All reports go to a central server accessible by authorized shelters.

### 2.3 Feasibility Study

#### 2.3.1 Technical Feasibility
The project is technically feasible as it uses established technologies. Next.js and React are industry standards for web development. The OpenAI API provides a reliable interface for AI capabilities without requiring massive local computational power. Cloudinary handles image storage efficiently.

#### 2.3.2 Operational Feasibility
The system is designed to be user-friendly, requiring no special training for the public. Shelters need only a basic internet-connected device to access the dashboard. Therefore, operational feasibility is high.

#### 2.3.3 Economic Feasibility
The development uses open-source frameworks (React, Next.js) and free-tier or low-cost cloud services (Vercel, MongoDB/PostgreSQL free tiers). The cost of the OpenAI API is scalable based on usage. Thus, the project is economically viable.

### 2.4 Requirement Analysis

#### 2.4.1 Functional Requirements
*   **User Registration**: Users should be able to sign up/login (optional for emergency reporting).
*   **Report Submission**: Users must be able to upload photos and submit location.
*   **AI Analysis**: The system must return an analysis of the uploaded image.
*   **Shelter Dashboard**: Shelters must be able to view and update report status.

#### 2.4.2 Non-Functional Requirements
*   **Performance**: The application should load within 3 seconds on 4G networks.
*   **Reliability**: The system should be available 99.9% of the time.
*   **Scalability**: The backend should handle concurrent requests during peak times.
*   **Security**: User data and location information must be encrypted and protected.

---

## CHAPTER 3: SYSTEM DESIGN

### 3.1 System Architecture
The system utilizes a **Microservices-based architecture** (logically separated within a Monorepo).
*   **Presentation Layer**: Next.js Frontend (React Components).
*   **Application Layer**: Next.js API Routes (Serverless Functions).
*   **Data Layer**: PostgreSQL Database managed via Prisma ORM.
*   **External Services Layer**: OpenAI (Intelligence), Cloudinary (Media), Mapbox/Leaflet (Maps).

### 3.2 Data Flow Diagram (DFD) Description
1.  **Level 0**: User -> Submits Report -> System. System -> Notifies Shelter.
2.  **Level 1**:
    *   User uploads Image -> Image Service (Cloudinary).
    *   Image URL -> AI Service (OpenAI) -> Analysis Result.
    *   Analysis + Location -> Database.
    *   Database -> Shelter Dashboard.

### 3.3 Database Design (ER Model Description)
Key entities in the database include:
*   **User**: Stores user profile (Name, Contact, Role).
*   **Report**: Stores incident details (Image URL, Location Lat/Long, AI Analysis JSON, Status, Timestamp).
*   **Shelter**: Stores shelter details (Name, Address, Capacity, Contact).
*   **Comment**: Stores updates on a specific report.

### 3.4 User Interface Design
The UI is designed with a **"Mobile-First"** approach, recognizing that most reports will come from users on the street.
*   **Minimalism**: The reporting screen focuses solely on the camera and location to reduce cognitive load during emergencies.
*   **Accessibility**: High contrast colors and large buttons are used to ensure usability for all demographics.

---

## CHAPTER 4: AI METHODOLOGY & ALGORITHMS

### 4.1 Introduction to AI in Triage
Artificial Intelligence in this project serves as a "First Responder." Its role is not to replace veterinary diagnosis but to provide an immediate, automated assessment to prioritize cases.

### 4.2 Model Architecture: GPT-4o (Omni)
We utilize **GPT-4o**, a state-of-the-art Large Multimodal Model (LMM) developed by OpenAI.
*   **Multimodality**: Unlike Unimodal models (text-only or image-only), GPT-4o accepts mixed inputs (Text + Image) and processes them in a shared embedding space.
*   **Transformer Architecture**: It is based on the Transformer architecture, utilizing self-attention mechanisms to understand the relationship between different parts of the image and the user's query.

### 4.3 Image Processing Pipeline
1.  **Input**: The user captures a raw image (JPEG/PNG).
2.  **Compression**: The client-side app compresses the image to <5MB to optimize bandwidth and API latency.
3.  **Encoding**: The image is encoded into Base64 or uploaded to a temporary URL.
4.  **Inference Request**: A POST request is sent to the OpenAI API with the image and the System Prompt.

### 4.4 Prompt Engineering Strategy
The performance of the AI relies heavily on the "System Prompt." We use a **Chain-of-Thought (CoT)** prompting strategy.
*   *Prompt Extract*: "You are an expert veterinary assistant. Analyze the image step-by-step. First, identify if an animal is present. Second, identify the species. Third, scan for visible injuries (blood, limping, wounds). Fourth, assess the environment for danger. Finally, output a JSON object."
*   This structured prompting reduces hallucinations and ensures consistent data formatting.

### 4.5 Zero-Shot Learning & Capabilities
The model exhibits **Zero-Shot Learning**, meaning it can identify injuries it has never been explicitly trained on during fine-tuning, simply because it has "seen" similar concepts in its vast pre-training dataset. This allows the system to recognize rare animals or unusual accident scenarios without custom model training.

---

## CHAPTER 5: TECHNOLOGY STACK

### 5.1 Frontend Technologies
*   **Next.js 15**: Chosen for its Server-Side Rendering (SSR) capabilities, which improve SEO and initial load performance—critical for a public-facing web app.
*   **React 19**: Provides a component-based architecture, making the code modular and reusable.
*   **Tailwind CSS v4**: Allows for rapid UI development without writing custom CSS files, ensuring consistency and small bundle sizes.

### 5.2 Backend Technologies
*   **Node.js**: A non-blocking, event-driven runtime perfect for handling I/O-heavy operations like image uploads and API requests.
*   **Prisma ORM**: Provides a type-safe interface to the database, preventing SQL injection attacks and reducing runtime errors.

### 5.3 Database
*   **PostgreSQL**: An advanced, open-source relational database known for its reliability and support for complex queries (including geospatial queries via PostGIS, if needed).

### 5.4 Third-Party APIs
*   **OpenAI API**: For intelligence.
*   **Cloudinary**: For media management (auto-cropping, resizing, and format optimization).
*   **Leaflet**: An open-source JavaScript library for mobile-friendly interactive maps.

---

## CHAPTER 6: IMPLEMENTATION & TESTING

### 6.1 Module Description
*   **`app/page.tsx`**: The landing page and entry point.
*   **`components/report-form.tsx`**: The core component handling camera access and form submission.
*   **`app/api/analyze/route.ts`**: The server-side route that acts as a secure gateway to the OpenAI API.
*   **`lib/ai-prompt.ts`**: Contains the engineered prompts for the AI.

### 6.2 Testing Strategies

#### 6.2.1 Unit Testing
Individual components (like the "Submit" button or "Location Permission" dialog) were tested in isolation to ensure they behave correctly under various states (loading, error, success).

#### 6.2.2 Integration Testing
The flow from "Image Capture" -> "API Call" -> "Database Save" was tested to ensure that data is correctly passed between the frontend, backend, and external APIs.

#### 6.2.3 User Acceptance Testing (UAT)
The application was tested with a small group of users to verify that the flow is intuitive. Feedback (e.g., "The camera button is too small") was incorporated into the final design.

---

## CHAPTER 7: CONCLUSION & FUTURE SCOPE

### 7.1 Conclusion
The "Animal Shelter Helpline" project successfully demonstrates the potential of technology to solve real-world problems. By integrating GPT-4o, we have democratized access to expert-level triage, allowing anyone with a smartphone to become an effective animal rescuer. The system reduces the cognitive load on the reporter and provides actionable intelligence to the rescuer.

### 7.2 Limitations
*   **Dependency on Connectivity**: The AI features require an active internet connection.
*   **AI Hallucinations**: While rare, the AI may occasionally misinterpret an image (e.g., confusing a sleeping dog for an injured one).
*   **Lighting Conditions**: Poor lighting at night can degrade AI accuracy.

### 7.3 Future Scope
*   **Offline Mode**: Implementing local TensorFlow.js models for basic offline detection.
*   **Video Analysis**: Extending the AI to analyze short video clips for gait analysis (limping detection).
*   **IoT Integration**: Connecting with smart collars or city cameras for automated stray tracking.
*   **Vernacular Support**: Adding multi-language support to reach a wider demographic in rural areas.

---

## REFERENCES
1.  Next.js Documentation. (n.d.). Retrieved from https://nextjs.org/docs
2.  OpenAI. (2024). GPT-4o System Card. Retrieved from https://openai.com/
3.  React Documentation. (n.d.). Retrieved from https://react.dev/
4.  Tailwind CSS. (n.d.). Retrieved from https://tailwindcss.com/
5.  Prisma. (n.d.). Retrieved from https://www.prisma.io/
